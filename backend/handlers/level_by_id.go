package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"it1shka.com/code-adventure-backend/database"
)

func handleLevelById(c echo.Context) error {
  idRaw := c.Param("id")
  idValue, err := strconv.ParseUint(idRaw, 10, 32)
  if err != nil {
    msg := "Level ID should be a positive integer"
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  level, err := database.GetLevel(uint(idValue))
  if err != nil {
    msg := "Internal server error"
    return echo.NewHTTPError(http.StatusBadRequest, msg)
  }
  return c.JSON(http.StatusOK, level)
}
