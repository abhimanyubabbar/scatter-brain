package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/m4rw3r/uuid"
)

var thoughtMap map[ThoughtsID]Thoughts

func init() {
	logrus.Info("Intiliazing the data structures.")
	thoughtMap = make(map[ThoughtsID]Thoughts)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := new(mux.Router)
	r.HandleFunc("/api/ping", pingHandler)
	r.HandleFunc("/api/thoughts", thoughtsPostHandler).Methods("POST")
	r.HandleFunc("/api/thoughts/{id}", thoughtsGetHandler).Methods("GET")

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public/"))))
	http.ListenAndServe(":"+port, r)
}

type Status struct {
	Status  string
	Service string
}

// Handles checking the basic availability of the application.
func pingHandler(rw http.ResponseWriter, r *http.Request) {

	response := Status{"pong", "scatter-brain"}
	resp, _ := json.Marshal(response)
	rw.Write(resp)
}

// Handles the addition of a new user thought in the system.
func thoughtsPostHandler(rw http.ResponseWriter, r *http.Request) {

	logrus.Info("Adding a new thought to the system.")
	decoder := json.NewDecoder(r.Body)
	logrus.Info(r.Body)

	thoughtsPost := ThoughtsPost{}
	err := decoder.Decode(&thoughtsPost)

	if err != nil {
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("Json decoding failed.")

		httpError(rw, http.StatusBadRequest, err)
		return
	}

	id, _ := uuid.V4()
	thoughtsID := ThoughtsID{id}

	// Create a new thoughts object.
	thoughts := Thoughts{
		ID:          thoughtsID,
		CreatedTime: time.Now(),
		Title:       thoughtsPost.Title,
		Content:     thoughtsPost.Thought,
	}

	// Store the value in the thoughts map.
	thoughtMap[thoughts.ID] = thoughts

	resp, err := json.Marshal(thoughts)
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusCreated)
	rw.Write(resp)
}

// Handles the fetch of a particular thought from the map for now.
func thoughtsGetHandler(rw http.ResponseWriter, r *http.Request) {

	logrus.Info("Received a call to fetch the thoughts")

	vars := mux.Vars(r)
	idString := vars["id"]
	id, err := uuid.FromString(idString)

	if err != nil {
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("Invalid url param.")

		httpError(rw, http.StatusBadRequest, err)
		return
	}

	// If the entry is being located successfully.
	if thought, ok := thoughtMap[ThoughtsID{id}]; ok {

		resp, err := json.Marshal(thought)
		if err != nil {
			httpError(rw, http.StatusInternalServerError, err)
			return
		}

		rw.Header().Set("Content-Type", "application/json")
		rw.WriteHeader(http.StatusOK)
		rw.Write(resp)
		return
	}

	httpError(rw, http.StatusNotFound, errors.New("Unable to locate the resource."))
}
