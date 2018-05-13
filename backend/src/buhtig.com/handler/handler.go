package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
)

type errorStruct struct {
	Error string `json:"error"`
}

func IsDev() bool {
	for _, e := range os.Environ() {
		pair := strings.Split(e, "=")
		if pair[0] == "DEV" && pair[1] == "1" {
			return true
		}
	}
	return false
}

func setDevCORS(w http.ResponseWriter) {
	if IsDev() {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	}
}

func SendJson(w http.ResponseWriter, jsonBytes []byte) {
	w.Header().Set("Content-Type", "application/json")
	setDevCORS(w)
	if IsDev() {
		print(string(jsonBytes))
	}
	w.Write(jsonBytes)
}

func SendOKJson(w http.ResponseWriter, jsonBytes []byte) {
	w.Header().Set("Content-Type", "application/json")
	setDevCORS(w)
	w.WriteHeader(http.StatusOK)
	if IsDev() {
		print(string(jsonBytes))
	}
	w.Write(jsonBytes)
}

func SendErrorJson(w http.ResponseWriter, errCode int, errorText string) {
	w.Header().Set("Content-Type", "application/json")
	errorJson, _ := json.Marshal(&errorStruct{
		Error: errorText,
	})
	setDevCORS(w)
	w.WriteHeader(errCode)
	if IsDev() {
		print(string(errorJson))
	}
	w.Write(errorJson)
}

func SendBadRequest(w http.ResponseWriter, errorText string) {
	SendErrorJson(w, http.StatusBadRequest, errorText)
}

func SendUnauthorized(w http.ResponseWriter, errorText string) {
	SendErrorJson(w, http.StatusUnauthorized, errorText)
}

func SendForbidden(w http.ResponseWriter, errorText string) {
	SendErrorJson(w, http.StatusForbidden, errorText)
}

func SendNotFound(w http.ResponseWriter, errorText string) {
	SendErrorJson(w, http.StatusNotFound, errorText)
}

func SendServerError(w http.ResponseWriter, errorText string) {
	SendErrorJson(w, http.StatusInternalServerError, errorText)
}
