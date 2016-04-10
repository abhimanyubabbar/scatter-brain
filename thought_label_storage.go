package main

import (
	"database/sql"
)

type ThoughtLabelStorage struct {
	db *sql.DB
}

// Initialize : Execute the database schema against
// the database.
func (tls ThoughtLabelStorage) Initialize() error {
	schemas := tls.GetDBSchemas()
	for _, schema := range schemas {
		if _, err := tls.db.Exec(schema); err != nil {
			return err
		}
	}
	return nil
}

//GetDBSchemas : DB schema exposed by the storage component.
func (tls ThoughtLabelStorage) GetDBSchemas() []string {

	return []string{
		`CREATE TABLE IF NOT EXISTS thought_with_labels(
			thought_id UUID REFERENCES thought ON DELETE CASCADE,
			label_id INTEGER REFERENCES label ON DELETE CASCADE,
			PRIMARY KEY(thought_id, label_id)
		)`,
	}
}

func (tls ThoughtLabelStorage) AddLabelToThought(tl ThoughtLabel) error {

	q := `INSERT INTO thought_with_labels (thought_id, label_id) VALUES ($1, $2)`
	_, err := tls.db.Exec(q, tl.Thought, tl.Label)
	return err
}
