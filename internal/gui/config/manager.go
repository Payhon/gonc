package config

import (
	"encoding/json"
	"errors"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
)

// AppConfig 描述 GUI 层的基础配置。
type AppConfig struct {
	DefaultSTUN  []string   `json:"defaultStun"`
	DefaultMQTT  []string   `json:"defaultMqtt"`
	UI           UISettings `json:"ui"`
	ConfigSource string     `json:"configSource"`
}

// UISettings 表示 GUI 偏好设置。
type UISettings struct {
	Theme         string `json:"theme"`
	Language      string `json:"language"`
	RememberState bool   `json:"rememberState"`
}

// Manager 管理配置的读取与持久化。
type Manager struct {
	mu          sync.RWMutex
	config      AppConfig
	storagePath string
}

// NewManager 创建 Manager 并尝试加载磁盘配置。
func NewManager() *Manager {
	manager := &Manager{
		config:      DefaultConfig(),
		storagePath: defaultConfigPath(),
	}

	if err := manager.loadFromDisk(); err != nil && !errors.Is(err, os.ErrNotExist) {
		slog.Warn("failed to load GUI config, fallback to default", "error", err)
	}

	return manager
}

// DefaultConfig 返回默认配置。
func DefaultConfig() AppConfig {
	return AppConfig{
		DefaultSTUN: []string{
			"stun.l.google.com:19302",
			"stun1.l.google.com:19302",
		},
		DefaultMQTT: []string{
			"mqtt://broker.emqx.io:1883",
		},
		UI: UISettings{
			Theme:         "dark",
			Language:      "zh-CN",
			RememberState: true,
		},
		ConfigSource: "default",
	}
}

// Current 返回当前配置快照。
func (m *Manager) Current() AppConfig {
	m.mu.RLock()
	defer m.mu.RUnlock()

	out := m.config
	out.DefaultSTUN = cloneStrings(out.DefaultSTUN)
	out.DefaultMQTT = cloneStrings(out.DefaultMQTT)
	return out
}

// UpdateUI 更新 UI 偏好并持久化。
func (m *Manager) UpdateUI(ui UISettings) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.config.UI = ui
	return m.persistLocked()
}

// persistLocked 将当前配置写入磁盘（调用者须持有写锁）。
func (m *Manager) persistLocked() error {
	if m.storagePath == "" {
		return errors.New("storage path not initialized")
	}

	if err := os.MkdirAll(filepath.Dir(m.storagePath), 0o755); err != nil {
		return err
	}

	payload, err := json.MarshalIndent(m.config, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(m.storagePath, payload, 0o600)
}

// loadFromDisk 读取磁盘配置。
func (m *Manager) loadFromDisk() error {
	if m.storagePath == "" {
		return errors.New("storage path not initialized")
	}

	raw, err := os.ReadFile(m.storagePath)
	if err != nil {
		return err
	}

	var diskConfig AppConfig
	if err := json.Unmarshal(raw, &diskConfig); err != nil {
		return err
	}

	diskConfig.ConfigSource = m.storagePath

	m.mu.Lock()
	m.config = diskConfig
	m.mu.Unlock()
	return nil
}

func defaultConfigPath() string {
	cfgDir, err := os.UserConfigDir()
	if err != nil {
		return ""
	}
	return filepath.Join(cfgDir, "gonc", "gui", "config.json")
}

func cloneStrings(input []string) []string {
	if len(input) == 0 {
		return nil
	}
	out := make([]string, len(input))
	copy(out, input)
	return out
}
