export const GUI_EVENTS = {
  appReady: "gui:app:ready",
  appLifecycle: "gui:app:lifecycle",
  logStream: "gui:log:stream"
} as const;

export type GuiEventKey = keyof typeof GUI_EVENTS;
