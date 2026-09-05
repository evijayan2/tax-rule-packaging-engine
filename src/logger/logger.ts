/**
 * Structured Logger for the Tax Rule Packaging Engine.
 * Formats diagnostic output as structured JSON or level-prefixed messages
 * without raw console.log calls in production paths.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

class StructuredLogger implements ILogger {
  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {})
    };
  }

  private write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry(level, message, context);
    const serialized = JSON.stringify(entry);
    if (level === "error") {
      process.stderr.write(`${serialized}\n`);
    } else {
      process.stdout.write(`${serialized}\n`);
    }
  }

  /**
   * Logs a debug level message.
   */
  public debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.DEBUG === "true" || process.env.NODE_ENV === "development") {
      this.write("debug", message, context);
    }
  }

  /**
   * Logs an informational message.
   */
  public info(message: string, context?: Record<string, unknown>): void {
    this.write("info", message, context);
  }

  /**
   * Logs a warning message.
   */
  public warn(message: string, context?: Record<string, unknown>): void {
    this.write("warn", message, context);
  }

  /**
   * Logs an error message.
   */
  public error(message: string, context?: Record<string, unknown>): void {
    this.write("error", message, context);
  }
}

/**
 * Singleton instance of the structured logger.
 */
export const logger: ILogger = new StructuredLogger();

