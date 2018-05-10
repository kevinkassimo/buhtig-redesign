package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/globalsign/mgo"
	
	"app/account"
	"app/constant"
	"app/api"
)

func main() {
	router := mux.NewRouter()
	session, _ := mgo.Dial(constant.MONGO_URL)
	account.NewAccountRouter(router, session)
	api.NewAPIRouter(router, session)
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world"))
	})

	http.ListenAndServe(":8000", router)
}