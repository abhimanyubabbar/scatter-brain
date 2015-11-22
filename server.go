package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := new(mux.Router)
	r.HandleFunc("/api/ping", pingHandler)
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public/"))))
	http.ListenAndServe(":"+port, r)
}

type Status struct {
	Status  string
	Service string
}

func pingHandler(rw http.ResponseWriter, r *http.Request) {

	response := Status{"pong", "scatter-brain"}
	resp, _ := json.Marshal(response)
	rw.Write(resp)
}
