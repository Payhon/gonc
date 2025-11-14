package state

import (
	"context"
	"log/slog"
	"sync"
	"time"
)

const defaultLogBufferSize = 500

// LogService 管理 GUI 的日志缓冲与广播。
type LogService struct {
	eventHub *EventHub

	mu     sync.RWMutex
	buffer []LogPayload
	max    int
}

// NewLogService 创建日志服务。
func NewLogService(eventHub *EventHub, capacity int) *LogService {
	if capacity <= 0 {
		capacity = defaultLogBufferSize
	}
	return &LogService{
		eventHub: eventHub,
		max:      capacity,
		buffer:   make([]LogPayload, 0, capacity),
	}
}

// Append 添加日志并广播。
func (l *LogService) Append(entry LogPayload) {
	if entry.Timestamp == "" {
		entry.Timestamp = time.Now().UTC().Format(time.RFC3339Nano)
	}
	l.mu.Lock()
	l.buffer = append(l.buffer, entry)
	if len(l.buffer) > l.max {
		excess := len(l.buffer) - l.max
		l.buffer = l.buffer[excess:]
	}
	l.mu.Unlock()

	if l.eventHub != nil {
		l.eventHub.Publish(EventLogStream, entry)
	}
}

// Snapshot 返回日志缓冲的拷贝。
func (l *LogService) Snapshot() []LogPayload {
	l.mu.RLock()
	defer l.mu.RUnlock()
	out := make([]LogPayload, len(l.buffer))
	copy(out, l.buffer)
	return out
}

// WrapHandler 将 slog.Handler 包装为同时广播的 Handler。
func (l *LogService) WrapHandler(base slog.Handler) slog.Handler {
	return &logBroadcastHandler{
		base: base,
		svc:  l,
	}
}

type logBroadcastHandler struct {
	base slog.Handler
	svc  *LogService
}

func (h *logBroadcastHandler) Enabled(ctx context.Context, level slog.Level) bool {
	if h.base == nil {
		return true
	}
	return h.base.Enabled(ctx, level)
}

func (h *logBroadcastHandler) Handle(ctx context.Context, record slog.Record) error {
	if record.Time.IsZero() {
		record.Time = time.Now()
	}

	payload := LogPayload{
		Level:     record.Level.String(),
		Message:   record.Message,
		Timestamp: record.Time.UTC().Format(time.RFC3339Nano),
	}

	record.Attrs(func(attr slog.Attr) bool {
		if attr.Key == "source" && attr.Value.Kind() == slog.KindString {
			payload.Source = attr.Value.String()
		}
		return true
	})

	var err error
	if h.base != nil {
		err = h.base.Handle(ctx, record)
	}

	h.svc.Append(payload)
	return err
}

func (h *logBroadcastHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	var nextBase slog.Handler
	if h.base != nil {
		nextBase = h.base.WithAttrs(attrs)
	}
	return &logBroadcastHandler{
		base: nextBase,
		svc:  h.svc,
	}
}

func (h *logBroadcastHandler) WithGroup(name string) slog.Handler {
	var nextBase slog.Handler
	if h.base != nil {
		nextBase = h.base.WithGroup(name)
	}
	return &logBroadcastHandler{
		base: nextBase,
		svc:  h.svc,
	}
}
