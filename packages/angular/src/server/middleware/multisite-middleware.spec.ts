import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMultisiteMiddleware } from './multisite-middleware';

describe('MultisiteMiddleware', () => {
  it('should return a middleware', () => {
    expect(createMultisiteMiddleware()).toBeDefined();
  });
  it('should use provided sites collection', () => {});
  it('should resolve site from request by cookie', () => {});
  it('should resolve site from request by query parameter', () => {});
  it('should resolve site from request by hostname', () => {});
  it('should skip when in edting,preview mode', () => {});
  it('should skip when in api route', () => {});
  it('should skip when in static files', () => {});
  it('should skip when in health check', () => {});
  it('should skip when in static files', () => {});
});
