package state

import (
	"context"
	"log/slog"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// EventHub 负责统一的事件广播。
type EventHub struct {
	mu      sync.RWMutex
	ctx     context.Context
	enabled bool
}

// NewEventHub 创建 EventHub。
func NewEventHub() *EventHub {
	return &EventHub{}
}

// SetRuntime 设置 runtime context。
func (h *EventHub) SetRuntime(ctx context.Context) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.ctx = ctx
	h.enabled = true
}

// Publish 将事件推送给前端，如果 runtime 尚未就绪则忽略。
func (h *EventHub) Publish(event string, payload any) {
	h.mu.RLock()
	ctx := h.ctx
	enabled := h.enabled
	h.mu.RUnlock()

	if !enabled || ctx == nil {
		slog.Debug("event hub skipped publish, runtime not ready", "event", event)
		return
	}

	runtime.EventsEmit(ctx, event, payload)
}
