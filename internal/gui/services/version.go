package services

import (
	"runtime"
	"runtime/debug"
	"strings"
	"time"
)

// 这些变量可在编译时通过 -ldflags 注入。
var (
	AppVersion = ""
	GitCommit  = ""
	BuildTime  = ""
)

// VersionOverview 描述 GUI 的版本信息。
type VersionOverview struct {
	Name      string   `json:"name"`
	Version   string   `json:"version"`
	Commit    string   `json:"commit"`
	BuildDate string   `json:"buildDate"`
	GoVersion string   `json:"goVersion"`
	Features  []string `json:"features"`
}

// DetectVersion 根据构建信息生成版本概览。
func DetectVersion() VersionOverview {
	version := fallback(AppVersion, extractModuleVersion())
	commit := fallback(GitCommit, "dev")
	buildDate := normalizeBuildTime(BuildTime)

	return VersionOverview{
		Name:      "gonc GUI",
		Version:   version,
		Commit:    commit,
		BuildDate: buildDate,
		GoVersion: runtime.Version(),
		Features: []string{
			"p2p",
			"proxy",
			"files",
			"terminal",
		},
	}
}

func extractModuleVersion() string {
	info, ok := debug.ReadBuildInfo()
	if !ok || info == nil {
		return "v0.0.0-dev"
	}
	if info.Main.Version != "" && info.Main.Version != "(devel)" {
		return info.Main.Version
	}
	return "v0.0.0-dev"
}

func fallback(value string, alt string) string {
	if strings.TrimSpace(value) == "" {
		return alt
	}
	return value
}

func normalizeBuildTime(raw string) string {
	if strings.TrimSpace(raw) == "" {
		return time.Now().UTC().Format(time.RFC3339)
	}
	if ts, err := time.Parse(time.RFC3339, raw); err == nil {
		return ts.Format(time.RFC3339)
	}
	return raw
}
