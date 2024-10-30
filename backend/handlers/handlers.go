package handlers

import (
	"github.com/labstack/echo/v4"
)

const DEFAULT_PAGE_SIZE uint64 = 25

func SetupHandlers(app *echo.Echo) {
  app.GET("/level/list", handleLevelList)
  app.GET("/level/:id", handleLevelById)
  app.POST("/level/new", handleNewLevel)
  app.GET("/random/level-name", handleRandomLevelName)
  app.GET("/random/author-name", handleRandomAuthorName)
  app.GET("/level/page-size", handleLevelPageCount)
}
