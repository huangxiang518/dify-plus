package gaia

import api "github.com/flipped-aurora/gin-vue-admin/server/api/v1"

type RouterGroup struct {
	DashboardRouter
	QuotaRouter
	TenantsRouter
	SystemRouter
	TestRouter
}

var (
	dashboardApi = api.ApiGroupApp.GaiaApiGroup.DashboardApi
	tenantsApi   = api.ApiGroupApp.GaiaApiGroup.TenantsApi
)
var systemOAuth2Api = api.ApiGroupApp.GaiaApiGroup.SystemOAuth2Api
var systemApi = api.ApiGroupApp.GaiaApiGroup.SystemApi
var quotaApi = api.ApiGroupApp.GaiaApiGroup.QuotaApi
var testApi = api.ApiGroupApp.GaiaApiGroup.TestApi
