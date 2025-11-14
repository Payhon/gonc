package state

// 事件名称常量，统一前后端标识。
const (
	EventAppReady     = "gui:app:ready"
	EventAppLifecycle = "gui:app:lifecycle"
	EventLogStream    = "gui:log:stream"
)

// LifecycleStage 表示应用生命周期状态。
type LifecycleStage string

const (
	LifecycleStageStartup  LifecycleStage = "startup"
	LifecycleStageShutdown LifecycleStage = "shutdown"
)

// AppLifecyclePayload 是生命周期事件的负载。
type AppLifecyclePayload struct {
	Stage LifecycleStage `json:"stage"`
}

// LogPayload 描述一条日志消息。
type LogPayload struct {
	Level     string `json:"level"`
	Message   string `json:"message"`
	Source    string `json:"source,omitempty"`
	Timestamp string `json:"timestamp"`
}
