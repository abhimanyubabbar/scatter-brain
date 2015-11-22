package main

import (
	"encoding/json"
	"net/http"
)

// Generic method to handle error response.
func httpError(rw http.ResponseWriter, statusCode int, err error) {
	rw.WriteHeader(statusCode)
	rw.Header().Set("Content-Type", "application/json")
	resp, _ := json.Marshal(err.Error())
	rw.Write(resp)
}
