package main

import (
	"net/http"
	"os"

	"github.com/globalsign/mgo"
	"github.com/gorilla/mux"

	"buhtig.com/account"
	"buhtig.com/api"
	"buhtig.com/constant"
	"buhtig.com/handler"
)

func redirect(w http.ResponseWriter, req *http.Request) {
	// remove/add not default ports from req.Host
	target := "https://" + req.Host + req.URL.Path
	if len(req.URL.RawQuery) > 0 {
		target += "?" + req.URL.RawQuery
	}
	http.Redirect(w, req, target, http.StatusTemporaryRedirect)
}

func main() {
	router := mux.NewRouter()
	session, _ := mgo.Dial(constant.MONGO_URL)
	account.NewAccountRouter(router, session)
	api.NewAPIRouter(router, session)

	if handler.IsDev() {
		router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("404 - Not Found"))
		})
		http.ListenAndServe(":8000", router)
	} else {
		// "/" counts as not found
		router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			filePath := constant.STATIC_DIR + r.URL.Path
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				http.ServeFile(w, r, "/site/index.html")
			} else {
				http.ServeFile(w, r, filePath)
			}
		})

		//http.ListenAndServe(":80", http.HandlerFunc(redirect))
		http.ListenAndServe(":80", router)
		//http.ListenAndServeTLS(":443", constant.CERT_PATH, constant.KEY_PATH, router)
	}
}
