# gonc GUI 版本开发方案（Wails + React + Ant Design）

## 1. 项目背景与目标
gonc 目前以 CLI 形态提供强大的 P2P 打洞、加密隧道、文件传输与代理能力，功能丰富但操作门槛较高。目标是基于 Wails + React + TypeScript + Ant Design 打造跨平台桌面 GUI，降低学习成本，提供可视化配置、实时状态监控与自动化运维体验，同时复用现有核心逻辑，保持与 CLI 一致的能力覆盖。

## 2. 功能范围概述
- **快速连接**：以向导引导填入目标主机、端口、协议、TLS/PSK、ACL 等选项，一键发起连接或监听。
- **P2P 会话管理**：图形化管理 session key、MQTT 协调、STUN 服务器策略，展示候选地址、最终通路、重试与回退策略。
- **文件与服务**：配置 HTTP 文件分享、断点续传、下载目录；暴露 :mux、:s5s、:sh、:service 等内置服务模式。
- **代理与转发**：可视化 socks5、HTTP CONNECT、透明代理配置，展示状态与流量统计。
- **终端与调试**：内嵌 WebTTY/终端组件，支持 :sh 交互；展示实时日志、传输速率、统计数据。
- **访问控制与安全**：GUI 编辑 ACL 列表、生成与导入 PSK、证书管理、TLS 参数校验。
- **历史记录与模板**：保存常用配置、模板化参数、导入导出配置文件。
- **监控与诊断**：实时显示连接拓扑、NAT 类型识别、日志检索、错误提示。
- **自动更新与打包**：提供版本检测、构建脚本、跨平台安装包（Windows/MSI、macOS/dmg、Linux/AppImage）。

## 3. 技术架构设计
- **Wails 主程序**：Go 1.21+，复用现有包（apps、easyp2p、secure、misc 等），通过 service 层封装为 GUI 可调用的 API。
- **前端技术栈**：React 18 + TypeScript，Ant Design 5 负责布局与组件，React Router v6 管理路由，React Query 负责 API 状态与缓存，Zustand 维护全局 UI 状态（例如当前会话、日志级别、主题）。
- **通信机制**：Wails 提供 Go <-> JS binding；采用异步调用（promise）与事件推送（publish/subscribe）传递实时日志、进度、状态。
- **配置与持久化**：Go 层使用 Viper 或自研 JSON/YAML 读写配置；前端通过 IndexedDB 或 localStorage 缓存表格视图、偏好设置。
- **日志与监控**：Go 层利用 channel 将 runtime 日志流式推送，前端使用虚拟化列表显示；支持日志级别筛选与导出。
- **国际化与本地化**：Ant Design 配合 react-i18next，为后续中英双语 UI 做准备。

## 4. 模块划分与目录规划
- **Go 侧（./cmd/gui 或 ./app）**
  - `main.go`：Wails 初始化、窗口参数、资源嵌入。
  - `internal/bridge`：对外暴露的 Wails 绑定接口，包含连接控制、P2P 管理、文件服务等。
  - `internal/services`：复用现有 CLI 逻辑，包装为可复用服务；增加任务队列、状态机。
  - `internal/state`：会话状态、事件广播、日志缓冲。
  - `internal/config`：配置读写、模板管理、兼容 CLI 参数。
- **前端（./frontend）**
  - `src/main.tsx`：入口、主题、路由。
  - `src/app/layouts`：主布局、导航、顶部工具条。
  - `src/app/pages`：功能页面，如 Dashboard、Connections、P2P、Files、Proxy、Tools、Settings。
  - `src/app/components`：表单、日志面板、拓扑图、速率卡片、终端组件。
  - `src/app/store`：Zustand store。
  - `src/app/services`：封装 Wails 调用与 WebSocket/事件订阅。
  - `src/app/hooks`：如 useSessions、useLogs。
  - `src/app/theme`：Ant Design 主题定制（深色、浅色）。

## 5. 前后端交互流程
- **初始化**：前端启动后请求后台获取版本信息、默认配置、可用 STUN/MQTT 列表；订阅日志频道。
- **创建任务**：前端提交表单 -> JS 调用绑定方法 -> Go service 组装参数 -> 通过现有 apps 模块启动任务 -> 返回任务 ID。
- **实时状态**：Go 使用 goroutine 监听 session 事件（连接开始/重试/成功/失败），通过 Wails 事件推送；前端 React Query 接收并更新状态卡片。
- **文件传输**：Go 填充进度结构体并推送，前端展示进度条；前端可发起暂停、终止命令。
- **终端会话**：Go 复用 pseudo-terminal，与前端 WebTTY 组件通过 Wails 事件通道传输；需处理编码、按键映射。
- **配置保存**：前端导出 JSON -> Go 持久化到 `~/.config/gonc/gui/config.json`；支持导出 `gonc` CLI 命令示例。

## 6. UI 信息架构与主要界面
- **总览 Dashboard**：展示当前会话、最近任务、网络拓扑、带宽统计、快速操作入口（Antd Card + Statistic）。
- **连接向导**：使用 Steps + Form + Tabs，分为目标、认证、安全、网络、进阶；右侧实时生成 CLI 命令预览。
- **P2P 控制台**：展示对端信息、NAT 类型、打洞流程时间轴、日志；提供重试、MQTT 协调策略切换。
- **文件服务**：树形目录与上传下载进度列表，依赖 Antd Upload、Table；支持拖放上传、本地路径选择（Wails Dialog）。
- **代理中心**：管理 socks5/local、HTTP CONNECT、透明代理，显示监听端口、ACL 情况、当前客户端数量。
- **终端与日志**：内嵌 xterm.js 或 @ant-design/pro-editor terminal；日志面板提供级别过滤、关键字搜索、导出按钮。
- **设置**：主题、语言、更新通道、默认 STUN/MQTT 列表、自启动策略、诊断开关。
- **模板库**：列表呈现常用配置，支持一键应用或导出。

## 7. 状态管理与数据模型
- **React Query**：封装 `useQuery`/`useMutation` 拉取 Wails API，自动缓存和重试。
- **Zustand**：存储 UI 状态（侧边栏折叠、当前任务 ID、主题）、订阅事件流并合并到 store。
- **类型定义**：在 `@/types` 定义 Config、Session、LogEntry、TransferTask、ProxyProfile、Template 等接口，确保前后端一致，用 `wails generate` 生成 TS 类型。
- **事件处理**：统一 `eventBus.ts`，将 Go 推送转换为覆盖式 state 更新或追加日志。

## 8. 核心后端实现要点
- **服务抽象**：为每个 CLI 子系统建立独立 service（`P2PService`、`ProxyService`、`FileService`、`ShellService`），通过接口定义启动、停止、状态查询方法。
- **任务管理**：实现任务调度器，跟踪 goroutine，支持取消、重试与资源清理，避免阻塞 UI。
- **日志聚合**：统一采用 `zap` 或标准 log 包，支持多消费者读取；限制缓存大小，自动清理。
- **错误传播**：结构化错误信息（代码、消息、建议），前端根据 code 显示 Antd message/notification。
- **配置兼容**：向前兼容 CLI 配置文件；读写后保留注释/顺序可通过 HCL/yaml.v3 或结构化 JSON 实现；提供与 CLI 参数互转功能。

## 9. 开发迭代规划
- **阶段 0（1 周）**：环境准备、Wails 模板初始化、引入 Antd、构建基础布局、打通 Go <-> JS 调用演示。
- **阶段 1（2~3 周）**：实现连接向导、任务启动、实时日志；完成 CLI 命令预览、基础存储。
- **阶段 2（2 周）**：P2P 控制台、STUN/MQTT 配置、NAT 诊断展示；实现会话生命周期管理。
- **阶段 3（2 周）**：文件服务界面、断点续传控制、下载进度；内置代理、:mux 模式配置。
- **阶段 4（2 周）**：终端嵌入、ACL 编辑器、模板库；完善日志、通知体系。
- **阶段 5（1 周）**：打包、安装器、自动更新检查；撰写使用手册、录制演示。

## 10. 测试与质量保障
- **Go 单元测试**：针对 service 层、配置转换、事件推送编写测试；使用 gomock 模拟网络层。
- **前端测试**：Jest + React Testing Library 覆盖表单验证、hooks；Playwright 进行端到端冒烟。
- **集成测试**：通过 GitHub Actions 触发 Wails 构建、运行 CLI 回归测试；引入多平台 CI（Windows、macOS、Linux）。
- **性能监测**：使用 pprof 分析长连接性能；前端引入 Web Vitals 监控并记录关键指标。

## 11. 安全与合规注意事项
- 默认开启 TLS/PSK 提示，检测弱口令；敏感配置加密存储（AES-GCM + 系统密钥）。
- 日志脱敏（隐藏 PSK、密码、token）；提供一键清理。
- 前端下载/上传路径需要用户确认，避免越权访问。
- 支持导入自定义证书、MQTT 凭证，校验格式合法性。

## 12. 打包与部署
- Wails 目标：`wails build -platform windows/amd64,windows/arm64,linux/amd64,darwin/universal`。
- Windows 使用 MSI/Wix Toolset；macOS 使用 notarization 流程；Linux 提供 AppImage + .deb。
- 自动更新方案：Squirrel（Windows）+ Sparkle（macOS）或自建版本检查 API。

## 13. 资源需求与风险
- 需要熟悉 Wails 的 Go 工程师 1~2 名、前端工程师 1~2 名、QA 1 名。
- **风险**：Pty 与终端交互在不同平台差异大；P2P NAT 穿透依赖网络环境；Wails 生态对新特性的支持有限；Antd 的桌面交互可能与原生期望不符。
- **缓解**：引入平台专测矩阵、实现软回退（如失败时提示用 CLI）、关注 Wails 更新日志并锁定版本。

## 14. 后续扩展方向
- 集成 WebRTC 数据通道或 QUIC 作为补充传输。
- 提供插件接口，允许自定义服务或脚本。
- 引入团队协作功能：远程共享会话、集中日志。
- 云端配置同步与集中管理（结合 MQTT）。

---

此方案作为初始蓝图，可在迭代中根据用户反馈与技术验证进行细化与调整。
