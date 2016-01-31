package main

import (
	"database/sql"
	"errors"
	"time"
)

type ThoughtStorage struct {
	db *sql.DB
}

var ErrNoRowUpdated = errors.New("Unable to update the row.")
var ErrNoRecordFound = errors.New("Unable to locate the record.")

// Initialize : Execute the database schema against
// the database.
func (ts ThoughtStorage) Initialize() error {
	schemas := ts.GetDBSchemas()
	for _, schema := range schemas {
		if _, err := ts.db.Exec(schema); err != nil {
			return err
		}
	}
	return nil
}

//GetDBSchemas : DB schema exposed by the storage component.
func (ts ThoughtStorage) GetDBSchemas() []string {

	return []string{
		`CREATE TABLE IF NOT EXISTS thoughts(
			id UUID PRIMARY KEY,
			title TEXT,
			content TEXT,
			create_time TIMESTAMP,
			update_time TIMESTAMP
		)`,
	}
}

func (ts ThoughtStorage) AddThought(data ThoughtsPost) (*Thought, error) {

	now := time.Now()
	thought := Thought{
		ID:         GenThoughtID(),
		Title:      data.Title,
		Content:    data.Thought,
		CreateTime: now,
		UpdateTime: now,
	}

	q := `INSERT INTO thoughts (id, title, content, create_time, update_time)
	VALUES($1, $2, $3, $4, $5)`

	_, err := ts.db.Exec(q, thought.ID, thought.Title, thought.Content,
		thought.CreateTime, thought.UpdateTime)

	if err != nil {
		return nil, err
	}

	return &thought, nil
}

func (ts ThoughtStorage) UpdateThought(thought Thought) error {

	thought.UpdateTime = time.Now()
	q := `UPDATE thoughts SET title = $1, content= $2, update_time= $3
	where id = $4`

	result, err := ts.db.Exec(q, thought.Title, thought.Content,
		thought.UpdateTime, thought.ID)

	if err != nil {
		return err
	}
	// Atleast some row needs to be updated.
	// Otherwise return an error, indicating the same.
	i, _ := result.RowsAffected()
	if i <= 0 {
		return ErrNoRowUpdated
	}

	return nil
}

func (ts ThoughtStorage) GetThought(id ThoughtsID) (Thought, error) {

	var title, content string
	var create_time, update_time time.Time
	q := `SELECT title, content, create_time, update_time
	FROM thoughts WHERE id = $1`

	err := ts.db.QueryRow(q, id).Scan(&title, &content,
		&create_time, &update_time)

	var thought Thought
	switch {
	case err == sql.ErrNoRows:
		return thought, ErrNoRecordFound
	case err != nil:
		return thought, err
	default:
		thought = Thought{ID: id, Title: title,
			Content: content, CreateTime: create_time, UpdateTime: update_time}
	}

	return thought, nil
}

func (ts ThoughtStorage) GetAllThoughts() ([]Thought, error) {

	var thoughts []Thought
	q := `SELECT id, title, content, create_time, update_time FROM thoughts`

	rows, err := ts.db.Query(q)
	if err != nil {
		return thoughts, err
	}

	defer rows.Close()

	for rows.Next() {

		var title, content string
		var create_time, update_time time.Time
		var id ThoughtsID

		if err := rows.Scan(&id, &title, &content, &create_time, &update_time); err != nil {
			return thoughts, err
		}

		thought := Thought{
			ID:         id,
			Title:      title,
			Content:    content,
			CreateTime: create_time,
			UpdateTime: update_time,
		}
		thoughts = append(thoughts, thought)
	}
	return thoughts, nil
}
