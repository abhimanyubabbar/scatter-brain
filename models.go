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

// Thought : Main structure of the system.
type Thought struct {
	ID         ThoughtsID `json:"id"`
	Title      string     `json:"title"`
	Content    string     `json:"content"`
	CreateTime time.Time  `json:"create_time"`
	UpdateTime time.Time  `json:"update_time"`
}

type ThoughtsID struct {
	uuid.UUID
}

func GenThoughtID() ThoughtsID {
	id, _ := uuid.V4()
	return ThoughtsID{id}
}
