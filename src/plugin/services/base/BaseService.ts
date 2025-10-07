import { IServiceResult, IServiceError } from '../../types/interfaces';
import { TErrorCode, TLogLevel } from '../../types/types';
import { ELogLevel } from '../../types/enums';

/**
 * Base Service Class - Foundation for all services
 * Provides common functionality, logging, error handling, and utilities
 */
export abstract class BaseService {
  protected serviceName: string;
  protected isInitialized: boolean = false;
  protected startTime: number;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.startTime = Date.now();
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logOperation(ELogLevel.WARN, 'Service already initialized');
      return;
    }

    try {
      await this.onInitialize();
      this.isInitialized = true;
      this.logOperation(ELogLevel.INFO, 'Service initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation(ELogLevel.ERROR, 'Service initialization failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Shutdown the service
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      this.logOperation(ELogLevel.WARN, 'Service not initialized, skipping shutdown');
      return;
    }

    try {
      await this.onShutdown();
      this.isInitialized = false;
      this.logOperation(ELogLevel.INFO, 'Service shutdown successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation(ELogLevel.ERROR, 'Service shutdown failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    serviceName: string;
    isInitialized: boolean;
    uptime: number;
    startTime: number;
  } {
    return {
      serviceName: this.serviceName,
      isInitialized: this.isInitialized,
      uptime: Date.now() - this.startTime,
      startTime: this.startTime
    };
  }

  /**
   * Create standardized error result
   */
  protected createErrorResult<T>(
    code: TErrorCode,
    message: string,
    details?: Record<string, any>
  ): IServiceResult<T> {
    const error: IServiceError = {
      code,
      message,
      details: {
        serviceName: this.serviceName,
        timestamp: new Date().toISOString(),
        ...details
      }
    };

    return {
      success: false,
      error
    };
  }

  /**
   * Create standardized success result
   */
  protected createSuccessResult<T>(
    data: T,
    metadata?: Record<string, any>
  ): IServiceResult<T> {
    return {
      success: true,
      data,
      metadata: {
        serviceName: this.serviceName,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }

  /**
   * Log operation with context
   */
  protected logOperation(
    level: TLogLevel,
    message: string,
    data?: Record<string, any>
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...data
    };

    // Use appropriate console method based on level
    switch (level) {
      case ELogLevel.DEBUG:
        console.debug(`[${timestamp}] [${this.serviceName}] [DEBUG] ${message}`, data);
        break;
      case ELogLevel.INFO:
        console.info(`[${timestamp}] [${this.serviceName}] [INFO] ${message}`, data);
        break;
      case ELogLevel.WARN:
        console.warn(`[${timestamp}] [${this.serviceName}] [WARN] ${message}`, data);
        break;
      case ELogLevel.ERROR:
        console.error(`[${timestamp}] [${this.serviceName}] [ERROR] ${message}`, data);
        break;
      case ELogLevel.FATAL:
        console.error(`[${timestamp}] [${this.serviceName}] [FATAL] ${message}`, data);
        break;
      default:
        console.log(`[${timestamp}] [${this.serviceName}] [${level}] ${message}`, data);
    }
  }

  /**
   * Validate service is initialized
   */
  protected validateInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(`${this.serviceName} is not initialized`);
    }
  }

  /**
   * Execute operation with error handling
   */
  protected async executeOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<IServiceResult<T>> {
    const operationId = this.generateOperationId();
    
    try {
      this.validateInitialized();
      
      this.logOperation(ELogLevel.DEBUG, `Starting operation: ${operationName}`, {
        operationId
      });

      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;

      this.logOperation(ELogLevel.DEBUG, `Operation completed: ${operationName}`, {
        operationId,
        duration
      });

      return this.createSuccessResult(result, {
        operationId,
        operationName,
        duration
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logOperation(ELogLevel.ERROR, `Operation failed: ${operationName}`, {
        operationId,
        error: errorMessage
      });

      return this.createErrorResult(
        'UNKNOWN_ERROR' as TErrorCode,
        errorMessage,
        { operationId, operationName }
      );
    }
  }

  /**
   * Generate unique operation ID
   */
  protected generateOperationId(): string {
    return `${this.serviceName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current timestamp
   */
  protected getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Sanitize data for logging (remove sensitive information)
   */
  protected sanitizeForLogging(data: unknown): Record<string, unknown> | string | number | boolean | null {
    if (typeof data !== 'object' || data === null) {
      return data as string | number | boolean | null;
    }

    const sanitized = { ...(data as Record<string, unknown>) };
    
    // Remove common sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'credentials',
      'auth',
      'authorization'
    ];

    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Measure execution time
   */
  protected async measureExecutionTime<T>(
    operation: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;
    
    return { result, duration };
  }

  /**
   * Retry operation with exponential backoff
   */
  protected async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        this.logOperation(ELogLevel.WARN, `Operation failed, retrying in ${delay}ms`, {
          attempt,
          maxRetries,
          error: lastError.message
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // ============================================================================
  // ABSTRACT METHODS (to be implemented by subclasses)
  // ============================================================================

  /**
   * Called during service initialization
   */
  protected async onInitialize(): Promise<void> {
    // Default implementation - can be overridden
  }

  /**
   * Called during service shutdown
   */
  protected async onShutdown(): Promise<void> {
    // Default implementation - can be overridden
  }
}
