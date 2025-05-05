package system

import (
	"github.com/gin-gonic/gin"
)

type BaseRouter struct{}

func (s *BaseRouter) InitBaseRouter(Router *gin.RouterGroup) (R gin.IRoutes) {
	baseRouter := Router.Group("base")
	{
		baseRouter.POST("login", baseApi.Login)
		baseRouter.POST("captcha", baseApi.Captcha)
		baseRouter.POST("oaLogin", baseApi.OaLogin)              // 新增OA登录
		baseRouter.GET("auth2/callback", baseApi.OAuth2Callback) // 新增oAuth2回调校验
	}
	return baseRouter
}
