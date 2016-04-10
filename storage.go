package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var db_schema = []string{
	`CREATE TABLE IF NOT EXISTS thoughts(
		id UUID PRIMARY KEY,
		title TEXT,
		content TEXT,
		create_time TIMESTAMP,
		update_time TIMESTAMP
	)`,
}

// GetPostgresConnection : Get a hold of the database connection
// which could be used by other storage services.
func GetPostgresConnection() (*sql.DB, error) {

	db, err := sql.Open("postgres", `dbname=scatter_brain
	user=postgres password=postgres`)

	if err != nil {
		return nil, err
	}

	fmt.Println("Successfully connected to the database.")
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func InitializeStorage(schemas []string) error {

	db, err := GetPostgresConnection()
	if err != nil {
		return err
	}

	for _, schema := range schemas {
		if _, err := db.Exec(schema); err != nil {
			return err
		}
	}
	return nil
}
