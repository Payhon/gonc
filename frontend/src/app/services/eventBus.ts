type EventCallback<T = unknown> = (payload: T) => void;

const resolveRuntime = () => (window as any)?.runtime;

export const eventBus = {
  on<T = unknown>(event: string, callback: EventCallback<T>) {
    const runtime = resolveRuntime();
    if (!runtime?.EventsOn) {
      console.warn("runtime.EventsOn 不可用，事件监听将被忽略", event);
      return () => undefined;
    }
    const deregister = runtime.EventsOn(event, callback);
    return () => {
      try {
        if (typeof deregister === "function") {
          deregister();
        } else if (runtime.EventsOff) {
          runtime.EventsOff(event);
        }
      } catch (error) {
        console.error("移除事件监听失败", error);
      }
    };
  }
};
