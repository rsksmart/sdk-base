import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Logger, createLogger, logger } from '../src/logger'

describe('Logger', () => {
  const consoleSpy = {
    debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createLogger', () => {
    it('should create logger with default config', () => {
      const log = createLogger()

      expect(log).toBeInstanceOf(Logger)
      expect(log.getLevel()).toBe('info')
    })

    it('should create logger with custom prefix', () => {
      const log = createLogger({ prefix: '[Test]' })

      log.info('test message')

      expect(consoleSpy.info).toHaveBeenCalled()
      const logCall = consoleSpy.info.mock.calls[0]?.[0]
      expect(logCall).toContain('[Test]')
    })

    it('should create logger with custom level', () => {
      const log = createLogger({ level: 'debug' })

      expect(log.getLevel()).toBe('debug')
    })
  })

  describe('log levels', () => {
    it('should log debug messages when level is debug', () => {
      const log = createLogger({ level: 'debug' })

      log.debug('debug message')

      expect(consoleSpy.debug).toHaveBeenCalled()
    })

    it('should not log debug messages when level is info', () => {
      const log = createLogger({ level: 'info' })

      log.debug('debug message')

      expect(consoleSpy.debug).not.toHaveBeenCalled()
    })

    it('should log info messages when level is info', () => {
      const log = createLogger({ level: 'info' })

      log.info('info message')

      expect(consoleSpy.info).toHaveBeenCalled()
    })

    it('should log warn messages', () => {
      const log = createLogger()

      log.warn('warning message')

      expect(consoleSpy.warn).toHaveBeenCalled()
    })

    it('should log error messages', () => {
      const log = createLogger()

      log.error('error message')

      expect(consoleSpy.error).toHaveBeenCalled()
    })

    it('should not log anything when level is silent', () => {
      const log = createLogger({ level: 'silent' })

      log.debug('debug')
      log.info('info')
      log.warn('warn')
      log.error('error')

      expect(consoleSpy.debug).not.toHaveBeenCalled()
      expect(consoleSpy.info).not.toHaveBeenCalled()
      expect(consoleSpy.warn).not.toHaveBeenCalled()
      expect(consoleSpy.error).not.toHaveBeenCalled()
    })
  })

  describe('setLevel', () => {
    it('should change log level', () => {
      const log = createLogger({ level: 'info' })

      expect(log.getLevel()).toBe('info')

      log.setLevel('debug')

      expect(log.getLevel()).toBe('debug')
    })

    it('should affect future log calls', () => {
      const log = createLogger({ level: 'info' })

      log.debug('should not log')
      expect(consoleSpy.debug).not.toHaveBeenCalled()

      log.setLevel('debug')

      log.debug('should log now')
      expect(consoleSpy.debug).toHaveBeenCalled()
    })
  })

  describe('log with data', () => {
    it('should log additional data objects', () => {
      const log = createLogger({ level: 'info' })
      const data = { foo: 'bar', num: 42 }

      log.info('message', data)

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.any(String),
        data
      )
    })
  })

  describe('default logger', () => {
    it('should have default log level', () => {
      expect(logger.getLevel()).toBe('info')
    })
  })
})
