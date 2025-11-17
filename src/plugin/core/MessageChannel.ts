import { IPluginMessage, EPluginMessageType, IUIMessage, EUIMessageType } from '../../shared/types/messages';
import { IUIMessagePayloadMap } from '../../shared/types/messagePayloads';

type TMessageHandler<T extends EUIMessageType> = (payload: IUIMessagePayloadMap[T]) => Promise<void>;

export class MessageChannel {
  private static instance: MessageChannel;
  private handlers = new Map<EUIMessageType, TMessageHandler<any>>();

  private constructor() {}

  static getInstance(): MessageChannel {
    if (!MessageChannel.instance) {
      MessageChannel.instance = new MessageChannel();
    }
    return MessageChannel.instance;
  }

  initialize(): void {
    figma.ui.onmessage = async (message: IUIMessage) => {
      await this.handleMessage(message);
    };
  }

  on<T extends EUIMessageType>(type: T, handler: TMessageHandler<T>): void {
    this.handlers.set(type, handler);
  }

  private async handleMessage(message: IUIMessage): Promise<void> {
    const handler = this.handlers.get(message.type as EUIMessageType);
    
    if (handler) {
      try {
        await handler(message.payload);
      } catch (error) {
        this.sendError(message.type, error);
      }
    } else {
      this.sendError(message.type, new Error(`Unknown message type: ${message.type}`));
    }
  }

  send<T = unknown>(message: IPluginMessage<T>): void {
    figma.ui.postMessage(message);
  }

  sendSuccess<T = unknown>(type: EPluginMessageType, data?: T): void {
    this.send<T>({
      type,
      success: true,
      data,
      timestamp: Date.now()
    });
  }

  sendError(type: string, error: Error | unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.send({
      type: EPluginMessageType.ERROR,
      success: false,
      error: errorMessage,
      timestamp: Date.now()
    });
  }
}
