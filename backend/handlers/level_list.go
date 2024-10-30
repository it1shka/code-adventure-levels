package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"it1shka.com/code-adventure-backend/database"
)

func handleLevelList(c echo.Context) error {
  pageRaw := c.QueryParam("page")
  var page uint64
  if pageRaw == "" {
    page = 0
  } else {
    value, err := strconv.ParseUint(pageRaw, 32, 10)
    if err != nil {
      msg := "Page should be a natural number"
      return echo.NewHTTPError(http.StatusBadRequest, msg)
    }
    page = value
  }
  pageSizeRaw := c.QueryParam("page-size")
  var pageSize uint64
  if pageSizeRaw == "" {
    pageSize = DEFAULT_PAGE_SIZE
  } else {
    value, err := strconv.ParseUint(pageSizeRaw, 32, 10)
    if err != nil {
      msg := "Page size should be a natural number"
      return echo.NewHTTPError(http.StatusBadRequest, msg)
    }
    pageSize = value
  }
  levels, err := database.ListLevels(int(page), int(pageSize))
  if err != nil {
    msg := "Internal server error"
    return echo.NewHTTPError(http.StatusInternalServerError, msg)
  }
  return c.JSON(http.StatusOK, levels)
}
