package database

import (
	"time"
)

type Level struct {
  ID uint `gorm:"primaryKey;autoIncrement" json:"id"`
  CreatedAt time.Time `json:"created_at"`
  Parent *uint `json:"parent"`
  Title string `json:"title"`
  Author string `json:"author"`
  Field string  `json:"field"`
}

func ListLevels(page, pageSize int) ([]Level, error) {
  var output []Level
  err := globalConnection.
    Model(&Level{}).
    Offset(page * pageSize).
    Limit(pageSize).
    Find(&output).
    Error
  if err != nil {
    return nil, err
  }
  return output, nil
}

func NewLevel(title, author, field string, parent *uint) (*Level, error) {
  level := Level{
    Parent: parent,
    Title: title,
    Author: author,
    Field: field,
  }
  if err := globalConnection.Create(&level).Error; err != nil {
    return nil, err
  }
  return &level, nil
}

func GetLevel(id uint) (*Level, error) {
  level := Level{ID: id}
  if err := globalConnection.Find(&level).Error; err != nil {
    return nil, err
  }
  return &level, nil
}

func GetLevelPageCount(pageSize uint64) (uint64, error) {
  var recordCount int64
  err := globalConnection.Model(&Level{}).Count(&recordCount).Error
  if err != nil {
    return 0, err
  }
  pageCount := uint64(recordCount) / pageSize
  if uint64(recordCount) % pageSize > 0 {
    pageCount++
  }
  return pageCount, nil
}
