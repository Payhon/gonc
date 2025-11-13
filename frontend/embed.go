package frontendassets

import "embed"

// Assets 包含前端构建产物。
//
//go:embed all:dist
var Assets embed.FS
