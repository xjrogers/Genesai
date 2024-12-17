type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level: LogLevel;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private formatMessage(message: string, options: LogOptions): string {
    const contextStr = options.context ? ` ${JSON.stringify(options.context)}` : '';
    return `[${options.timestamp}] [${options.level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const options: LogOptions = {
      level,
      timestamp: new Date().toISOString(),
      context
    };

    const formattedMessage = this.formatMessage(message, options);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();