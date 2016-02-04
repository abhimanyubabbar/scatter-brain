package main

import (
	"time"

	"github.com/m4rw3r/uuid"
)

// Structure during the post.
type ThoughtsPost struct {
	Title   string `json:"title"`
	Thought string `json:"thought"`
}

type LabelsPost struct {
	Hexcode     string `json:"hex"`
	Description string `json:"description"`
}

// Thought : Main structure of the system.
type Thought struct {
	ID         ThoughtsID `json:"id"`
	Title      string     `json:"title"`
	Content    string     `json:"content"`
	CreateTime time.Time  `json:"create_time"`
	UpdateTime time.Time  `json:"update_time"`
}

// Label : A categorical overview associated with the thought.
type Label struct {
	Id          int    `json:"id"`  // Should be auto incremental.
	Hexcode     string `json:"hex"` // Needs to have default.
	Description string `json:"description"`
}

type ThoughtsID struct {
	uuid.UUID
}

func GenThoughtID() ThoughtsID {
	id, _ := uuid.V4()
	return ThoughtsID{id}
}
