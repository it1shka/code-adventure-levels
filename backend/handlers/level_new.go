package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"it1shka.com/code-adventure-backend/database"
)


func validateField(field string) error {
  lines := strings.Split(field, "\n")
  if len(lines) <= 0 {
    return errors.New("Level has 0 rows")
  }
  if len(lines[0]) <= 0 {
    return errors.New("Level has 0 columns")
  }
  robot, boxes, checkpoints := false, 0, 0
  for _, line := range lines {
    for _, symbol := range []rune(line) {
      switch symbol {
      case '>', 'V', '<', '^':
        if robot {
          return errors.New("Multiple starting points")
        }
        robot = true
      case 'O':
        boxes++
      case 'X':
        checkpoints++
      }
    }
  }
  if !robot {
    return errors.New("No starting point")
  }
  if boxes <= 0 {
    return errors.New("Level has no boxes")
  }
  if boxes != checkpoints {
    return errors.New("Amount of boxes and checkpoints doesn't match")
  }
  return nil
}

const MIN_TITLE_LENGTH = 4
const MIN_AUTHOR_LENGTH = 1

func handleNewLevel(c echo.Context) error {
  var body struct {
    Title string `json:"title"`
    Author string `json:"author"`
    Field string `json:"field"`
    Parent *uint `json:"parent"`
  }
  if err := json.NewDecoder(c.Request().Body).Decode(&body); err != nil {
    msg := "Wrong request body"
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  if len(body.Title) < MIN_TITLE_LENGTH {
    msg := "Title is too short"
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  if len(body.Author) < MIN_AUTHOR_LENGTH {
    msg := "Author name is too short"
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  if err := validateField(body.Field); err != nil {
    msg := err.Error()
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  level, err := database.NewLevel(body.Title, body.Author, body.Field, body.Parent)
  if err != nil {
    msg := "Internal server error"
    return echo.NewHTTPError(http.StatusInternalServerError, msg)
  }
  return c.JSON(http.StatusAccepted, level)
}
