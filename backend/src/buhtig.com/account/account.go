package account

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"

	"buhtig.com/constant"
	"buhtig.com/githubUrl"
	"buhtig.com/handler"
)

type User struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Login     string        `bson:"login"`
	AvatarURL string        `bson:"avatarUrl"`
	Token     string        `bson:"token"`
}

type errorStruct struct {
	Error string `json:"error"`
}

type userData struct {
	Login     string `json:"login"`
	AvatarURL string `json:"avatar_url"`
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie("jwt")
		if err != nil {
			handler.SendBadRequest(w, "no jwt present")
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

		if err != nil {
			handler.SendUnauthorized(w, "bad jwt")
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			context.Set(r, "login", claims["login"]) // set context
			next.ServeHTTP(w, r)
		} else {
			handler.SendUnauthorized(w, "bad jwt claims")
			return
		}
	})
}

func NewAccountRouter(router *mux.Router, session *mgo.Session) {
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

	s := router.PathPrefix("/account").Subrouter()

	s.Path("/auth_code").Queries("code", "{code}").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		code, ok := vars["code"]
		if !ok {
			handler.SendBadRequest(w, "no code provided")
			return
		}

		params := url.Values{
			"client_id":     {constant.OAuthClient.ClientID},
			"client_secret": {constant.OAuthClient.ClientSecret},
			"code":          {code},
		}

		httpClient := &http.Client{}

		req, err := http.NewRequest(
			"POST",
			"https://github.com/login/oauth/access_token",
			bytes.NewReader([]byte(params.Encode())),
		)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}
		req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		req.Header.Add("Accept", "application/json")
		resp, err := httpClient.Do(req)
		if err != nil {
			handler.SendServerError(w, "cannot get access token: "+err.Error())
			return
		}

		type oauthResp struct {
			AccessToken string `json:"access_token"`
			Scope       string `json:"scope"`
			TokenType   string `json:"token_type"`
		}

		body, err := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()
		if err != nil {
			handler.SendServerError(w, "cannot get access token: "+err.Error())
			return
		}
		authJson := &oauthResp{
			AccessToken: "",
			Scope:       "",
			TokenType:   "",
		}
		err = json.Unmarshal(body, &authJson)
		if err != nil {
			handler.SendServerError(w, "cannot get access token: "+err.Error())
			return
		}

		accessTokenQuery := url.Values{"access_token": {authJson.AccessToken}}.Encode()

		dataReq, err := http.NewRequest(
			"GET",
			githubUrl.API_URL_USER+"?"+accessTokenQuery,
			nil,
		)
		if err != nil {
			handler.SendServerError(w, "request error: "+err.Error())
			return
		}

		dataResp, err := httpClient.Do(dataReq)
		if err != nil {
			handler.SendServerError(w, "cannot get access token: "+err.Error())
			return
		}

		body, err = ioutil.ReadAll(dataResp.Body)
		defer dataResp.Body.Close()
		if err != nil {
			handler.SendServerError(w, "cannot get user data: "+err.Error())
			return
		}
		userDataJson := &userData{
			Login:     "",
			AvatarURL: "",
		}
		err = json.Unmarshal(body, &userDataJson)
		if err != nil {
			handler.SendServerError(w, "cannot get user data: "+err.Error())
			return
		}

		if userDataJson.Login == "" { // no login data
			handler.SendServerError(w, "cannot get user data: no login provided")
			return
		}
		var userResults []User
		err = coll.Find(bson.M{"login": userDataJson.Login}).All(&userResults)
		if err != nil {
			handler.SendServerError(w, "mongo error: "+err.Error())
			return
		}
		if len(userResults) == 0 { // has NO user
			// Insert new user
			err = coll.Insert(&User{
				Login:     userDataJson.Login,
				AvatarURL: userDataJson.AvatarURL,
				Token:     authJson.AccessToken,
			})
			if err != nil {
				handler.SendServerError(w, "mongo error: "+err.Error())
				return
			}
		} else { // has user
			err = coll.Update(
				bson.M{"login": userDataJson.Login},
				bson.M{"$set": bson.M{"avatarUrl": userDataJson.AvatarURL, "token": authJson.AccessToken}},
			)
			if err != nil {
				handler.SendServerError(w, "mongo error: "+err.Error())
				return
			}
		}

		token := jwt.New(jwt.SigningMethodHS256)
		claims := token.Claims.(jwt.MapClaims)
		claims["login"] = userDataJson.Login
		tokenString, err := token.SignedString([]byte(constant.JWT_KEY))

		if err != nil {
			handler.SendServerError(w, "sign failed: "+err.Error())
			return
		}

		respJsonString, err := json.Marshal(userDataJson)
		if err != nil {
			handler.SendServerError(w, "marshal failed: "+err.Error())
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    "jwt",
			Value:   tokenString,
			Expires: time.Now().Add(365 * 24 * time.Hour),
			MaxAge:  50000,
			Path:    "/",
		})
		handler.SendJson(w, respJsonString)
	}).Methods("POST")

	s.Handle("/user", authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		loginID := context.Get(r, "login")
		var userResults []User
		err := coll.Find(bson.M{"login": loginID}).All(&userResults)
		if err != nil {
			handler.SendServerError(w, "mongo error: "+err.Error())
			return
		}
		if len(userResults) == 0 { // has NO user
			// Insert new user
			handler.SendNotFound(w, "user not exist")
			return
		} else { // has user
			user := userResults[0]
			userDataString, err := json.Marshal(&userData{Login: user.Login, AvatarURL: user.AvatarURL})
			if err != nil {
				handler.SendServerError(w, "marshal error: "+err.Error())
				return
			}

			handler.SendJson(w, userDataString)
		}
	}))).Methods("GET")
}
