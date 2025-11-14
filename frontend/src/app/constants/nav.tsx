import {
  DashboardOutlined,
  ThunderboltOutlined,
  CloudUploadOutlined,
  ShareAltOutlined,
  CodeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ConsoleSqlOutlined
} from "@ant-design/icons";
import type { NavRoute } from "../types";

export const NAV_ITEMS: NavRoute[] = [
  { key: "dashboard", label: "总览", path: "/", icon: <DashboardOutlined /> },
  { key: "connections", label: "连接向导", path: "/connections", icon: <ThunderboltOutlined /> },
  { key: "p2p", label: "P2P 控制台", path: "/p2p", icon: <ShareAltOutlined /> },
  { key: "files", label: "文件服务", path: "/files", icon: <CloudUploadOutlined /> },
  { key: "proxy", label: "代理中心", path: "/proxy", icon: <CodeOutlined /> },
  { key: "terminal", label: "终端与日志", path: "/terminal", icon: <ConsoleSqlOutlined /> },
  { key: "templates", label: "模板库", path: "/templates", icon: <AppstoreOutlined /> },
  { key: "settings", label: "设置", path: "/settings", icon: <SettingOutlined /> }
];
