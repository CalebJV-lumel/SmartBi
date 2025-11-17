export class Logger {
  private static instance: Logger;
  private enabled = true;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  info(message: string, data?: unknown): void {
    if (!this.enabled) return;
    console.log(`[INFO] ${message}`, data ?? '');
  }

  warn(message: string, data?: unknown): void {
    if (!this.enabled) return;
    console.warn(`[WARN] ${message}`, data ?? '');
  }

  error(message: string, error?: unknown): void {
    if (!this.enabled) return;
    console.error(`[ERROR] ${message}`, error ?? '');
  }

  debug(message: string, data?: unknown): void {
    if (!this.enabled) return;
    console.debug(`[DEBUG] ${message}`, data ?? '');
  }
}
