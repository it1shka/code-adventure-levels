package database

import (
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const DEFAULT_DATABASE_FILE = "database.db"

var globalConnection *gorm.DB

func ConnectAndMigrate() error {
  file := os.Getenv("DATABASE_FILE")
  if file == "" {
    file = DEFAULT_DATABASE_FILE
  }
  db, err := gorm.Open(sqlite.Open(file), &gorm.Config{})
  if err != nil {
    return err
  }
  if err := db.AutoMigrate(&Level{}); err != nil {
    return err
  }
  globalConnection = db
  return nil
}
