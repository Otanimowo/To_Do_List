/**
 * Logger Utility
 * 
 * A centralized logging utility that can be easily toggled for production environments.
 * Provides consistent logging patterns and levels throughout the application.
 */

// Debug flag to enable/disable console logging
// Set to false for production builds
export const DEBUG = process.env.NODE_ENV !== 'production';

/**
 * Logger interface with methods for different log levels
 */
export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

/**
 * Creates a logger for a specific module/component
 * 
 * @param {string} module - The name of the module or component
 * @returns {Logger} Logger instance with module prefix
 */
export const createLogger = (module: string): Logger => {
  const prefix = `[${module}]`;
  
  return {
    info: (message: string, ...args: any[]) => {
      if (DEBUG) console.log(`${prefix} ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      if (DEBUG) console.warn(`${prefix} ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      if (DEBUG) console.error(`${prefix} ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      if (DEBUG && process.env.NODE_ENV === 'development') {
        console.debug(`${prefix} ${message}`, ...args);
      }
    }
  };
};

/**
 * Default logger instance for general use
 */
export const logger = createLogger('App');

export default createLogger; 