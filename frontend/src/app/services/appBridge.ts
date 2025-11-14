import type { AppConfigSnapshot, VersionOverview } from "../types";

const FALLBACK_VERSION: VersionOverview = {
  name: "gonc GUI",
  version: "v0.0.0-dev",
  commit: "dev",
  buildDate: new Date().toISOString(),
  goVersion: "unknown",
  features: []
};

const FALLBACK_CONFIG: AppConfigSnapshot = {
  defaultStun: ["stun.l.google.com:19302"],
  defaultMqtt: ["mqtt://broker.emqx.io:1883"],
  ui: {
    theme: "dark",
    language: "zh-CN",
    rememberState: true
  },
  configSource: "frontend-default"
};

type BridgeNamespace = {
  GetVersionInfo: () => Promise<VersionOverview>;
  GetAppConfig: () => Promise<AppConfigSnapshot>;
  SaveUserPreferences: (payload: AppConfigSnapshot["ui"]) => Promise<void>;
  StreamLogs: () => Promise<void>;
};

const resolveBridge = (): BridgeNamespace | undefined => {
  return (window as any)?.go?.gui?.bridge?.AppBridge;
};

export const appBridge = {
  async getVersionInfo(): Promise<VersionOverview> {
    const bridge = resolveBridge();
    if (!bridge?.GetVersionInfo) {
      return FALLBACK_VERSION;
    }
    try {
      return await bridge.GetVersionInfo();
    } catch (error) {
      console.error("GetVersionInfo failed", error);
      return FALLBACK_VERSION;
    }
  },

  async getAppConfig(): Promise<AppConfigSnapshot> {
    const bridge = resolveBridge();
    if (!bridge) {
      return FALLBACK_CONFIG;
    }
    try {
      const config = await bridge.GetAppConfig();
      return {
        ...FALLBACK_CONFIG,
        ...config
      };
    } catch (error) {
      console.error("getAppConfig failed", error);
      return FALLBACK_CONFIG;
    }
  },

  async saveUserPreferences(payload: AppConfigSnapshot["ui"]) {
    const bridge = resolveBridge();
    if (!bridge?.SaveUserPreferences) {
      console.warn("bridge SaveUserPreferences unavailable");
      return;
    }
    try {
      await bridge.SaveUserPreferences(payload);
    } catch (error) {
      console.error("SaveUserPreferences failed", error);
    }
  },

  async startLogStream() {
    const bridge = resolveBridge();
    if (!bridge?.StreamLogs) {
      return;
    }
    try {
      await bridge.StreamLogs();
    } catch (error) {
      console.error("StreamLogs failed", error);
    }
  }
};
