package handlers

import (
	"math/rand"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

var authorAdjectives = [...]string {
  "Compassionate", "Diligent", "Confident", 
  "Creative", "Honest", "Empathetic", 
  "Ambitious", "Charismatic", "Patient", "Generous",
}

var authorNouns = [...]string {
  "Warrior", "Mage", "Rogue", 
  "Paladin", "Hunter", "Necromancer", 
  "Assassin", "Healer", "Sorcerer", "Berserker",
}

func handleRandomAuthorName(c echo.Context) error {
  var idx int
  idx = rand.Intn(len(authorAdjectives))
  adjective := authorAdjectives[idx]
  idx = rand.Intn(len(authorNouns))
  noun := authorNouns[idx]
  postfix := rand.Intn(900) + 100
  name := adjective + noun + strconv.Itoa(postfix)
  return c.String(http.StatusOK, name)
}
