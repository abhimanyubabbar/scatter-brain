package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/m4rw3r/uuid"
)

var tp ThoughtProcessor

func init() {
	logrus.Info("Intiliazing the data structures.")
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9999"
	}

	db, err := GetPostgresConnection()
	if err != nil {
		panic(err)
	}

	tp = ThoughtProcessor{
		ThoughtStorage:      ThoughtStorage{db},
		LabelStorage:        LabelStorage{db},
		ThoughtLabelStorage: ThoughtLabelStorage{db},
	}

	if err := tp.Init(); err != nil {
		panic(err)
	}

	logrus.Info("Successfully initialized the processor.")

	r := new(mux.Router)
	r.HandleFunc("/api/ping", pingHandler)
	r.HandleFunc("/api/thoughts", thoughtsPostHandler).Methods("POST")
	r.HandleFunc("/api/thoughts", getAllThoughts).Methods("GET")
	r.HandleFunc("/api/thoughts/{id}", thoughtsGetHandler).Methods("GET")
	r.HandleFunc("/api/thoughts/{id}", editThoughtsHandler).Methods("PUT")

	r.HandleFunc("/api/labels", labelsPostHandler).Methods("POST")
	r.HandleFunc("/api/thought-labels", labelOnThoughtHandler).Methods("POST")

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

func labelOnThoughtHandler(rw http.ResponseWriter, r *http.Request) {
	var thoughtLabel ThoughtLabel
	decoder := json.NewDecoder(r.Body)

	err := decoder.Decode(&thoughtLabel)
	if err != nil {
		httpError(rw, http.StatusBadRequest, err)
		return
	}

	err = tp.ThoughtLabelStorage.AddLabelToThought(thoughtLabel)
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	resp, _ := json.Marshal(thoughtLabel)
	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusCreated)
	rw.Write(resp)
}

func labelsPostHandler(rw http.ResponseWriter, r *http.Request) {

	var postData LabelsPost
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&postData)

	if err != nil {
		httpError(rw, http.StatusBadRequest, err)
		return
	}

	label, err := tp.LabelStorage.AddLabel(postData)
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	resp, _ := json.Marshal(*label)
	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusCreated)
	rw.Write(resp)

}

func editThoughtsHandler(rw http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	idStr := vars["id"]

	_, err := uuid.FromString(idStr)
	if err != nil {
		httpError(rw, http.StatusBadRequest, errors.New("unable to parse the identifier."))
		return
	}

	var thought Thought
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&thought)
	if err != nil {
		httpError(rw, http.StatusBadRequest, errors.New("unable to parse the resource"))
		return
	}

	if err = tp.ThoughtStorage.UpdateThought(thought); err != nil {

		if err == ErrNoRowUpdated {
			httpError(rw,
				http.StatusNotFound,
				errors.New("No row updated."))
		} else {
			httpError(rw,
				http.StatusInternalServerError,
				errors.New("Internal server error."))
		}

		return
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusNoContent)
}

func getAllThoughts(rw http.ResponseWriter, r *http.Request) {

	thoughts, err := tp.ThoughtStorage.GetAllThoughts()
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	resp, err := json.Marshal(thoughts)
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	rw.Write(resp)
}

// Handles the addition of a new user thought in the system.
func thoughtsPostHandler(rw http.ResponseWriter, r *http.Request) {

	logrus.Info("Adding a new thought to the system.")
	decoder := json.NewDecoder(r.Body)

	thoughtsPost := ThoughtsPost{}
	err := decoder.Decode(&thoughtsPost)

	if err != nil {
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("Json decoding failed.")

		httpError(rw, http.StatusBadRequest, err)
		return
	}

	thought, err := tp.ThoughtStorage.AddThought(thoughtsPost)
	if err != nil {
		httpError(rw, http.StatusInternalServerError, err)
		return
	}

	resp, err := json.Marshal(*thought)
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

	thought, err := tp.ThoughtStorage.GetThought(ThoughtsID{id})
	if err != nil {
		switch err {
		case ErrNoRecordFound:
			httpError(rw, http.StatusNotFound, err)
		default:
			httpError(rw, http.StatusInternalServerError, err)
		}
		return
	}

	resp, _ := json.Marshal(thought)

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(http.StatusOK)
	rw.Write(resp)
	return
}
