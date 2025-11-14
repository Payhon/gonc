export interface VersionOverview {
  name: string;
  version: string;
  commit: string;
  buildDate: string;
  goVersion: string;
  features: string[];
}

export interface UISettings {
  theme: "light" | "dark";
  language: string;
  rememberState: boolean;
}

export interface AppConfigSnapshot {
  defaultStun: string[];
  defaultMqtt: string[];
  ui: UISettings;
  configSource: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "trace" | "debug" | "info" | "warn" | "error";
  message: string;
  source?: string;
}

export interface LogStreamPayload {
  level: string;
  message: string;
  source?: string;
  timestamp?: string;
}

export interface NavRoute {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}
