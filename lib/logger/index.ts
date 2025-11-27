/**
 * Logger utility
 * Provides configurable logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote?: boolean
  remoteEndpoint?: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private config: LoggerConfig

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      enableConsole: process.env.NODE_ENV !== 'production' || process.env.ENABLE_CONSOLE_LOGS === 'true',
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level]
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    return `${prefix} ${message}`
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) {
      return
    }

    const formattedMessage = this.formatMessage(level, message)

    if (this.config.enableConsole) {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage, ...args)
          break
        case 'info':
          console.info(formattedMessage, ...args)
          break
        case 'warn':
          console.warn(formattedMessage, ...args)
          break
        case 'error':
          console.error(formattedMessage, ...args)
          break
      }
    }

    // In production, you might want to send logs to a remote service
    if (this.config.enableRemote && this.config.remoteEndpoint && level === 'error') {
      this.sendToRemote(level, message, ...args).catch(() => {
        // Silently fail if remote logging fails
      })
    }
  }

  private async sendToRemote(level: LogLevel, message: string, ...args: unknown[]): Promise<void> {
    // Implement remote logging (e.g., to Sentry, LogRocket, etc.)
    // This is a placeholder for future implementation
    if (this.config.remoteEndpoint) {
      try {
        await fetch(this.config.remoteEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            level,
            message,
            args,
            timestamp: new Date().toISOString(),
            url: typeof window !== 'undefined' ? window.location.href : undefined,
          }),
        })
      } catch {
        // Silently fail
      }
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args)
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (error instanceof Error) {
      this.log('error', message, error.message, error.stack, ...args)
    } else {
      this.log('error', message, error, ...args)
    }
  }
}

// Export a singleton instance
export const logger = new Logger()

// Export the class for custom instances
export { Logger }

export type { LogLevel, LoggerConfig }

