package main

import (
	"database/sql"
)

type LabelStorage struct {
	db *sql.DB
}

func (ls LabelStorage) Initialize() error {

	schemas := ls.GetDBSchemas()
	for _, schema := range schemas {
		if _, err := ls.db.Exec(schema); err != nil {
			return err
		}
	}
	return nil
}

func (ls LabelStorage) GetDBSchemas() []string {

	schemas := []string{
		`
		CREATE TABLE IF NOT EXISTS label (
			id SERIAL PRIMARY KEY,
			description TEXT,
			hexcode TEXT
		);`,
		`
		INSERT INTO label (id, description, hexcode)
		SELECT 0, 'Default', 'None'
		WHERE NOT EXISTS (
			SELECT id FROM label where id=0
		);`,
	}

	return schemas
}

func (ls LabelStorage) AddLabel(post LabelsPost) (*Label, error) {

	var lastInsertId int

	q := `INSERT INTO label(hexcode, description) VALUES ($1, $2) RETURNING id`
	err := ls.db.QueryRow(q, post.Hexcode, post.Description).Scan(&lastInsertId)
	if err != nil {
		return nil, err
	}

	// TODO: Fix it properly to fetch the created structure from the database.
	label := Label{
		Id:          lastInsertId,
		Description: post.Description,
		Hexcode:     post.Hexcode,
	}

	return &label, nil
}

// GetAllLabels : Fetch all the labels from the database.
func (ls LabelStorage) GetAllLabels() (labels []Label, err error) {

	q := `SELECT id, description, hexcode FROM label`
	rows, err := ls.db.Query(q)

	if err != nil {
		return
	}

	defer rows.Close()

	for rows.Next() {

		var id int
		var description, hexcode string

		if err := rows.Scan(&id, &description, &hexcode); err != nil {
			return nil, err
		}

		label := Label{
			Id:          id,
			Hexcode:     hexcode,
			Description: description,
		}

		labels = append(labels, label)
	}

	// Provide with all the labels.
	return
}
