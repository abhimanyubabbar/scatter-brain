package main

import ()

type ThoughtProcessor struct {
	ThoughtStorage ThoughtStorage
}

func (tp *ThoughtProcessor) Init() error {

	if err := tp.ThoughtStorage.Initialize(); err != nil {
		return err
	}
	return nil
}
