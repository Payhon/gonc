import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { appBridge } from "../services/appBridge";
import { eventBus } from "../services/eventBus";
import { useAppStore } from "../store/appStore";
import { useLogStore } from "../store/logStore";
import { GUI_EVENTS } from "../constants/events";
import type { AppConfigSnapshot, LogStreamPayload, VersionOverview } from "../types";

interface BootstrapResult {
  version: VersionOverview;
  config: AppConfigSnapshot;
}

export const useAppBootstrap = () => {
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const addLog = useLogStore((state) => state.addLog);

  const query = useQuery<BootstrapResult>({
    queryKey: ["app-bootstrap"],
    queryFn: async () => {
      const [version, config] = await Promise.all([appBridge.getVersionInfo(), appBridge.getAppConfig()]);
      return { version, config };
    },
    staleTime: Infinity
  });

  useEffect(() => {
    if (query.data?.config.ui.theme) {
      setThemeMode(query.data.config.ui.theme);
    }
  }, [query.data?.config.ui.theme, setThemeMode]);

  useEffect(() => {
    appBridge.startLogStream();
    const unlisten = eventBus.on<LogStreamPayload>(GUI_EVENTS.logStream, (payload) => {
      const validLevels = ["trace", "debug", "info", "warn", "error"] as const;
      const normalizedLevel = validLevels.includes(payload.level as any)
        ? (payload.level as (typeof validLevels)[number])
        : "info";
      addLog({
        level: normalizedLevel,
        message: payload.message ?? "",
        source: payload.source,
        timestamp: payload.timestamp ?? new Date().toISOString()
      });
    });
    return () => {
      unlisten?.();
    };
  }, [addLog]);

  return query;
};
