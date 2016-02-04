package main

import ()

type ThoughtProcessor struct {
	ThoughtStorage ThoughtStorage
	LabelStorage   LabelStorage
}

func (tp *ThoughtProcessor) Init() error {

	if err := tp.ThoughtStorage.Initialize(); err != nil {
		return err
	}

	if err := tp.LabelStorage.Initialize(); err != nil {
		return err
	}
	return nil
}
