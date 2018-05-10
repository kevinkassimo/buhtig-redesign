package api

import (
	"net/http"
	"net/url"
	"fmt"
	"strconv"
	"encoding/json"
	"io/ioutil"

	"github.com/gorilla/mux"
	"github.com/gorilla/context"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/dgrijalva/jwt-go"
	"github.com/peterhellberg/link"

	"app/constant"
	"app/handler"
)

type User struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Login     string `bson:"login"`
	AvatarURL string `bson:"avatarUrl"`
	Token     string `bson:"token"`
}

func authMiddleware(coll *mgo.Collection, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie("jwt")
		if err != nil {
			handler.SendUnauthorized(w, "no jwt present")
			return
		}
		token, err := jwt.Parse(jwtCookie.Value, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
	
			// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
			return []byte(constant.JWT_KEY), nil
		})
	
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			var userResults []User
			err = coll.Find(bson.M{"login": claims["login"]}).All(&userResults)
			if err != nil {
				handler.SendServerError(w, "mongo error: "+err.Error())
				return
			}
			if len(userResults) == 0 { // has NO claimed user
				handler.SendUnauthorized(w, "bad jwt, no such user")
				return
			}
			context.Set(r, "access_token", userResults[0].Token) // set context
			next.ServeHTTP(w, r)
		} else {
			handler.SendUnauthorized(w, "bad jwt")
			return
		}
	})
}

func bindMiddleware(coll *mgo.Collection, f func(w http.ResponseWriter, r *http.Request)) http.Handler {
	return authMiddleware(coll, http.HandlerFunc(f))
}

func NewAPIRouter(router *mux.Router, session *mgo.Session) {
	coll := session.DB("buhtig").C("account")
	index := mgo.Index{
		Key:        []string{"login"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	indexErr := coll.EnsureIndex(index)
	if indexErr != nil {
		panic(indexErr.Error())
	}

	s := router.PathPrefix("/api").Subrouter()

	s.Path("/total_commit").Queries("owner", "{owner}", "repo", "{repo}").Handler(bindMiddleware(coll, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		owner, _ := vars["owner"] // enforced
		repo, _ := vars["repo"] // enforced

		sha := r.URL.Query().Get("sha") // Get sha/branch name, circumvent mux
		
		params := url.Values{
			"per_page": {"1"}, // trick: enforce page size = 1, get last page number = total commits number
			"sha": {sha}, // sha is basically the branch (at least that's what we pretend)
			"access_token": {context.Get(r, "access_token").(string)},
		}

		httpClient := &http.Client{}

		req, err := http.NewRequest(
			"GET",
			"https://api.github.com/repos/"+url.QueryEscape(owner)+"/"+url.QueryEscape(repo)+"/commits?"+params.Encode(),
			nil,
		)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}
		resp, err := httpClient.Do(req)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}
		defer resp.Body.Close()

		commitCount := -1 // negative means bad value
		for _, l := range link.ParseResponse(resp) {
			if l.Rel == "last" {
				u, err := url.Parse(l.URI)
				if err != nil {
					handler.SendServerError(w, "cannot parse link header correctly")
					return
				}
				q := u.Query()
				commitCountString := q["page"][0]
				commitCount, err = strconv.Atoi(commitCountString)
				if err != nil {
					handler.SendServerError(w, "strconv failed: "+err.Error())
					return
				}
				break
			}
		}
		type totalCommitCountStruct struct {
			Count int `json:"count"`
		}

		totalCommitJsonString, err := json.Marshal(&totalCommitCountStruct{Count: commitCount,})

		if err != nil {
			handler.SendServerError(w, "marshal failed: "+err.Error())
			return
		}
		
		handler.SendJson(w, []byte(totalCommitJsonString))
	}))

	s.Path("/commit").Queries("owner", "{owner}", "repo", "{repo}", "total", "{total}", "which", "{which}").Handler(bindMiddleware(coll, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		owner, _ := vars["owner"] // enforced
		repo, _ := vars["repo"] // enforced
		total, _ := vars["total"] // enforced
		totalNum, err := strconv.Atoi(total)
		if err != nil {
			handler.SendBadRequest(w, "invalid total: "+err.Error())
			return
		} else if totalNum <= 0 {
			handler.SendBadRequest(w, "total commit number is in invalid range")
			return
		}
		which, _ := vars["which"] // enforced
		whichNum, err := strconv.Atoi(which)
		if err != nil {
			handler.SendBadRequest(w, "invalid searched commit: "+err.Error())
			return
		} else if whichNum <= 0 || whichNum > totalNum {
			handler.SendBadRequest(w, "searched commit number is in invalid range")
			return
		}

		sha := r.URL.Query().Get("sha") // Get sha/branch name, circumvent mux

		// The following is based on our assumption of using 21 as page size
		indexFromLast := totalNum - whichNum
		currIndex := (indexFromLast+1) % 21 - 1
		if currIndex < 0 {
			currIndex += 21 // I am so bad at basic math...
		}
		pageNum := (indexFromLast / 21) + 1

		params := url.Values{
			"per_page": {"21"}, // magic number
			"sha": {sha}, // sha is basically the branch (at least that's what we pretend)
			"access_token": {context.Get(r, "access_token").(string)},
			"page": {strconv.Itoa(pageNum)},
		}

		httpClient := &http.Client{}

		req, err := http.NewRequest(
			"GET",
			"https://api.github.com/repos/"+url.QueryEscape(owner)+"/"+url.QueryEscape(repo)+"/commits?"+params.Encode(),
			nil,
		)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}
		resp, err := httpClient.Do(req)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}
		body, err := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()

		type commitCommitStruct struct {
			Message string `json:"message"`
		}
		type commitPersonStruct struct {
			Login string `json:"login"`
			AvatarURL string `json:"avatar_url"`
		}
		type commitStruct struct {
			Commit commitCommitStruct `json:"commit"`
			HtmlURL string `json:"html_url"`
			Author commitPersonStruct `json:"author"`
			Committer commitPersonStruct `json:"committer"`
		}

		var commits []commitStruct
		err = json.Unmarshal(body, &commits)
		if err != nil {
			handler.SendServerError(w, "cannot parse commits: "+err.Error())
			return
		}

		type responseStruct struct {
			CurrCommit int `json:"curr_commit"`
			CurrIndex int `json:"curr_index"`
			Commits []commitStruct `json:"commits"`
		}

		respJson := &responseStruct{
			CurrCommit: whichNum,
			CurrIndex: currIndex,
			Commits: commits,
		}

		respJsonString, err := json.Marshal(respJson)
		if err != nil {
			handler.SendServerError(w, "marshal failed: "+err.Error())
			return
		}

		handler.SendOKJson(w, respJsonString)
	}))
}