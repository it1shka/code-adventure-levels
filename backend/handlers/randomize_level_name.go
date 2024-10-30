package handlers

import (
	"math/rand"
	"net/http"

	"github.com/labstack/echo/v4"
)

var levelAdjectives = [...]string {
  "Bright", "Mysterious", "Energetic", 
  "Fragile", "Majestic", "Quiet", 
  "Vibrant", "Elegant", "Bold", "Serene",
}

var levelNouns = [...]string {
  "Mountain", "River", "Sun",
  "Tree", "Ocean", "Sky",
  "Bird", "Flower", "City", "Forest",
}

func handleRandomLevelName(c echo.Context) error {
  var idx int
  idx = rand.Intn(len(levelAdjectives))
  adjective := levelAdjectives[idx]
  idx = rand.Intn(len(levelNouns))
  noun := levelNouns[idx]
  return c.String(http.StatusOK, adjective + " " + noun)
}
