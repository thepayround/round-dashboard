/**
 * Centralized Logging Utility
 * 
 * Replaces console.log statements with a structured logging system
 * that can be configured per environment and sent to logging services.
 * 
 * Note: This file intentionally uses console.* for logging purposes.
 */

/* eslint-disable no-console */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = import.meta.env.DEV

  /**
   * Log debug information (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '')
    }
    // In production, send to logging service
    this.sendToLoggingService('info', message, context)
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '')
    this.sendToLoggingService('warn', message, context)
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error || '', context || '')
    
    // Send to error tracking service (Sentry, LogRocket, etc.)
    this.sendToErrorTracking(message, error, context)
  }

  /**
   * Log API request/response
   */
  api(method: string, url: string, status?: number, duration?: number): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${url}`, {
        status,
        duration: duration ? `${duration}ms` : undefined,
      })
    }
  }

  /**
   * Send logs to external logging service (implement based on your service)
   */
  private sendToLoggingService(
    _level: LogLevel,
    _message: string,
    _context?: LogContext
  ): void {
    if (!this.isDevelopment) {
      // TODO: Integrate with logging service (e.g., LogRocket, Datadog)
      // Example:
      // loggerService.log({ level, message, context, timestamp: new Date() })
    }
  }

  /**
   * Send errors to error tracking service (implement based on your service)
   */
  private sendToErrorTracking(
    _message: string,
    _error?: Error | unknown,
    _context?: LogContext
  ): void {
    if (!this.isDevelopment) {
      // TODO: Integrate with error tracking (e.g., Sentry)
      // Example:
      // Sentry.captureException(error, { extra: { message, ...context } })
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Convenience exports for common patterns
export const logApiCall = (method: string, url: string, status?: number, duration?: number) => {
  logger.api(method, url, status, duration)
}

export const logError = (message: string, error?: Error | unknown, context?: LogContext) => {
  logger.error(message, error, context)
}

