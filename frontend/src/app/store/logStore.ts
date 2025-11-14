import { create } from "zustand";
import type { LogEntry } from "../types";

interface LogState {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, "id">) => void;
  clear: () => void;
}

let counter = 0;

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (entry) =>
    set((state) => {
      const id = `log-${Date.now()}-${counter++}`;
      const nextLog: LogEntry = {
        id,
        timestamp: entry.timestamp ?? new Date().toISOString(),
        level: entry.level,
        message: entry.message,
        source: entry.source
      };
      const logs = [...state.logs, nextLog].slice(-500);
      return { logs };
    }),
  clear: () => set({ logs: [] })
}));
