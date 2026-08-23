// scripts/lib/logger.ts — Pino logger with child bindings (no pino-pretty to avoid test issues)

import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

// Use simple logger without pino-pretty to avoid transport issues in tests/CI
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  base: { service: 'catalog-generator' },
});

// Add pretty printing for development (manual, not via transport)
if (isDev && typeof console !== 'undefined') {
  const origInfo = logger.info.bind(logger);
  logger.info = (obj: any, msg?: string) => {
    console.log('[INFO]', msg || '', obj || '');
    origInfo(obj, msg);
  };
  const origError = logger.error.bind(logger);
  logger.error = (obj: any, msg?: string) => {
    console.error('[ERROR]', msg || '', obj || '');
    origError(obj, msg);
  };
  const origWarn = logger.warn.bind(logger);
  logger.warn = (obj: any, msg?: string) => {
    console.warn('[WARN]', msg || '', obj || '');
    origWarn(obj, msg);
  };
  const origDebug = logger.debug.bind(logger);
  logger.debug = (obj: any, msg?: string) => {
    console.debug('[DEBUG]', msg || '', obj || '');
    origDebug(obj, msg);
  };
}

export function createChildLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}

export const genLogger = createChildLogger({ module: 'generator' });
export const validateLogger = createChildLogger({ module: 'validator' });
export const buildLogger = createChildLogger({ module: 'build' });
export const dbLogger = createChildLogger({ module: 'database' });

export type Logger = typeof logger;