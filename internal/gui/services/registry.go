package services

import (
	"context"
	"log/slog"
	"maps"
	"sync"

	"github.com/threatexpert/gonc/v2/internal/gui/config"
	"github.com/threatexpert/gonc/v2/internal/gui/state"
)

// Service 表示可被 GUI 控制的后端服务。
type Service interface {
	Name() string
	Shutdown(ctx context.Context) error
}

// Registry 维护可供 GUI 调用的服务集合。
type Registry struct {
	cfgManager *config.Manager
	eventHub   *state.EventHub

	mu       sync.RWMutex
	services map[string]Service
	version  VersionOverview
}

// NewRegistry 创建服务注册表。
func NewRegistry(cfgManager *config.Manager, eventHub *state.EventHub) *Registry {
	return &Registry{
		cfgManager: cfgManager,
		eventHub:   eventHub,
		services:   make(map[string]Service),
		version:    DetectVersion(),
	}
}

// Register 添加服务。
func (r *Registry) Register(service Service) {
	if service == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.services == nil {
		r.services = make(map[string]Service)
	}
	r.services[service.Name()] = service
}

// Shutdown 调用所有服务的清理逻辑。
func (r *Registry) Shutdown(ctx context.Context) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for name, service := range r.services {
		if err := service.Shutdown(ctx); err != nil {
			slog.Warn("service shutdown failed", "service", name, "error", err)
		}
	}
}

// Services 返回注册服务的快照。
func (r *Registry) Services() map[string]Service {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return maps.Clone(r.services)
}

// Version 返回版本信息。
func (r *Registry) Version() VersionOverview {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.version
}
