package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"it1shka.com/code-adventure-backend/database"
	"it1shka.com/code-adventure-backend/handlers"
)

func main() {
  if err := godotenv.Load(); err != nil {
    log.Fatalln(err)
  }
  if err := database.ConnectAndMigrate(); err != nil {
    log.Fatalln(err)
  }
  app := echo.New()
  app.Use(middleware.CORS())
  handlers.SetupHandlers(app)
  port := os.Getenv("PORT")
  if port == "" {
    app.Logger.Warn("Port was not provided in .env")
    port = ":4040"
  }
  app.Logger.Fatal(app.Start(port))
}
