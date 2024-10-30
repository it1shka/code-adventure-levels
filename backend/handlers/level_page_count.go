package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"it1shka.com/code-adventure-backend/database"
)

func handleLevelPageCount(c echo.Context) error {
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
  pageCount, err := database.GetLevelPageCount(pageSize)
  if err != nil {
    msg := "Internal server error"
    return echo.NewHTTPError(http.StatusInternalServerError, msg)
  }
  pageCountStr := strconv.Itoa(int(pageCount))
  return c.String(http.StatusOK, pageCountStr)
}
