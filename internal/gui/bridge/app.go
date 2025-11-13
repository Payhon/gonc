package bridge

import (
	"context"
	"errors"
	"sync"

	"github.com/threatexpert/gonc/v2/internal/gui/config"
	"github.com/threatexpert/gonc/v2/internal/gui/services"
	"github.com/threatexpert/gonc/v2/internal/gui/state"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// AppBridge 暴露给前端的 Wails 绑定接口。
type AppBridge struct {
	cfgManager      *config.Manager
	eventHub        *state.EventHub
	serviceRegistry *services.Registry

	ctxMu sync.RWMutex
	ctx   context.Context
}

// NewAppBridge 创建 AppBridge 实例。
func NewAppBridge(cfgManager *config.Manager, eventHub *state.EventHub, serviceRegistry *services.Registry) *AppBridge {
	return &AppBridge{
		cfgManager:      cfgManager,
		eventHub:        eventHub,
		serviceRegistry: serviceRegistry,
	}
}

// OnStartup 在 Wails 窗口初始化时调用。
func (a *AppBridge) OnStartup(ctx context.Context) {
	a.ctxMu.Lock()
	a.ctx = ctx
	a.ctxMu.Unlock()

	a.eventHub.SetRuntime(ctx)
	a.eventHub.Publish(state.EventAppLifecycle, state.AppLifecyclePayload{Stage: state.LifecycleStageStartup})
}

// OnShutdown 在 Wails 关闭时调用。
func (a *AppBridge) OnShutdown(ctx context.Context) {
	a.eventHub.Publish(state.EventAppLifecycle, state.AppLifecyclePayload{Stage: state.LifecycleStageShutdown})
	a.serviceRegistry.Shutdown(ctx)
}

func (a *AppBridge) appContext() (context.Context, error) {
	a.ctxMu.RLock()
	defer a.ctxMu.RUnlock()

	if a.ctx == nil {
		return nil, errors.New("runtime context not ready")
	}

	return a.ctx, nil
}

// GetVersionInfo 返回版本与构建信息。
func (a *AppBridge) GetVersionInfo() services.VersionOverview {
	return a.serviceRegistry.Version()
}

// ListDefaultStunServers 返回默认 STUN 服务器列表。
func (a *AppBridge) ListDefaultStunServers() []string {
	return a.cfgManager.Current().DefaultSTUN
}

// ListDefaultMQTTBrokers 返回默认 MQTT broker 列表。
func (a *AppBridge) ListDefaultMQTTBrokers() []string {
	return a.cfgManager.Current().DefaultMQTT
}

// GetAppConfig 返回完整的配置快照。
func (a *AppBridge) GetAppConfig() config.AppConfig {
	return a.cfgManager.Current()
}

// SaveUserPreferences 保存 GUI 偏好设置。
func (a *AppBridge) SaveUserPreferences(preferences config.UISettings) error {
	return a.cfgManager.UpdateUI(preferences)
}

// StreamLogs 订阅日志事件并推送到前端。
func (a *AppBridge) StreamLogs() error {
	ctx, err := a.appContext()
	if err != nil {
		return err
	}

	runtime.EventsEmit(ctx, state.EventLogStream, state.LogPayload{
		Level:   "info",
		Message: "日志订阅已建立",
	})
	return nil
}
