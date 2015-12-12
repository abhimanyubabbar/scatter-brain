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

// Thoughts : Main structure of the system.
type Thoughts struct {
	ID          ThoughtsID `json:"id"`
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	CreatedTime time.Time  `json:"created_time"`
}

type ThoughtsID struct {
	uuid.UUID
}
