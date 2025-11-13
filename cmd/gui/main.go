package main

import (
	"context"
	"log/slog"
	"os"

	frontendassets "github.com/threatexpert/gonc/v2/frontend"
	"github.com/threatexpert/gonc/v2/internal/gui/bridge"
	"github.com/threatexpert/gonc/v2/internal/gui/config"
	"github.com/threatexpert/gonc/v2/internal/gui/services"
	"github.com/threatexpert/gonc/v2/internal/gui/state"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func main() {
	ctx := context.Background()

	eventHub := state.NewEventHub()
	logService := state.NewLogService(eventHub, 0)

	textHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})
	appLogger := slog.New(logService.WrapHandler(textHandler))
	slog.SetDefault(appLogger)

	appLogger.Info("gonc GUI 启动中")

	// 初始化基础依赖
	cfgManager := config.NewManager()
	serviceRegistry := services.NewRegistry(cfgManager, eventHub)
	appBridge := bridge.NewAppBridge(cfgManager, eventHub, logService, serviceRegistry)

	err := wails.Run(&options.App{
		Title:     "gonc GUI",
		Width:     1280,
		Height:    820,
		MinWidth:  1080,
		MinHeight: 720,
		AssetServer: &assetserver.Options{
			Assets: frontendassets.Assets,
		},
		OnStartup: func(wailsCtx context.Context) {
			appBridge.OnStartup(wailsCtx)
		},
		OnShutdown: func(wailsCtx context.Context) {
			appBridge.OnShutdown(wailsCtx)
		},
		Bind: []interface{}{
			appBridge,
		},
		OnDomReady: func(wailsCtx context.Context) {
			runtime.EventsEmit(wailsCtx, state.EventAppReady, nil)
		},
	})

	if err != nil {
		appLogger.ErrorContext(ctx, "unable to launch gonc GUI", "error", err)
	}
}
