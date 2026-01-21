import type { LogLevel, LoggerConfig } from './types'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

/**
 * SDK Logger with configurable log levels
 */
export class Logger {
  private level: LogLevel
  private prefix: string

  constructor(config: Partial<LoggerConfig> = {}) {
    this.level = config.level ?? 'info'
    this.prefix = config.prefix ?? '[RSK-SDK]'
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    return `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args)
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args)
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args)
    }
  }

  /**
   * Log error message
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args)
    }
  }
}

/**
 * Create a logger instance with custom configuration
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config)
}

/**
 * Default logger instance
 */
export const logger = createLogger()
