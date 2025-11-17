import { IUIMessage, EUIMessageType, IPluginMessage } from '../../shared/types/messages';

type TMessageListener<T = unknown> = (data: T) => void;

export class MessageBridge {
  private static instance: MessageBridge;
  private listeners = new Map<string, Set<TMessageListener>>();

  private constructor() {
    this.setupListener();
  }

  static getInstance(): MessageBridge {
    if (!MessageBridge.instance) {
      MessageBridge.instance = new MessageBridge();
    }
    return MessageBridge.instance;
  }

  private setupListener(): void {
    window.onmessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage as IPluginMessage | undefined;
      if (!message) return;

      const listeners = this.listeners.get(message.type);
      if (listeners) {
        listeners.forEach(listener => listener(message.data));
      }
    };
  }

  send<T = unknown>(message: IUIMessage<T>): void {
    parent.postMessage({ pluginMessage: message }, '*');
  }

  on<T = unknown>(type: string, callback: TMessageListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback as TMessageListener);

    return () => {
      this.listeners.get(type)?.delete(callback as TMessageListener);
    };
  }

  emit<T = unknown>(type: EUIMessageType, payload?: T): void {
    this.send<T>({ type, payload });
  }
}
