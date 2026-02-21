import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentMapService } from './component-map.service';
import { COMPONENT_MAP_TOKEN } from '../tokens';

@Component({ selector: 'sc-stub-a', standalone: true, template: '' })
class StubComponentA {}

@Component({ selector: 'sc-stub-b', standalone: true, template: '' })
class StubComponentB {}

describe('ComponentMapService', () => {
  let service: ComponentMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to an empty map', () => {
    expect(service.componentMap().size).toBe(0);
  });

  describe('with COMPONENT_MAP_TOKEN', () => {
    it('should initialize with the provided map', () => {
      const initial = new Map([['Hero', StubComponentA]]);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: COMPONENT_MAP_TOKEN, useValue: initial }],
      });
      const s = TestBed.inject(ComponentMapService);
      expect(s.getComponent('Hero')).toBe(StubComponentA);
    });
  });

  describe('register', () => {
    it('should add a single component entry', () => {
      service.register('Hero', StubComponentA);
      expect(service.getComponent('Hero')).toBe(StubComponentA);
    });

    it('should preserve existing entries on new registration', () => {
      service.register('Hero', StubComponentA);
      service.register('Promo', StubComponentB);
      expect(service.getComponent('Hero')).toBe(StubComponentA);
      expect(service.getComponent('Promo')).toBe(StubComponentB);
    });
  });

  describe('setComponentMap', () => {
    it('should replace the entire map', () => {
      service.register('OldComponent', StubComponentA);
      service.setComponentMap(new Map([['NewComponent', StubComponentB]]));
      expect(service.getComponent('OldComponent')).toBeUndefined();
      expect(service.getComponent('NewComponent')).toBe(StubComponentB);
    });
  });

  describe('getComponent', () => {
    it('should return undefined for an unknown name', () => {
      expect(service.getComponent('Unknown')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return false for unknown name', () => {
      expect(service.has('Unknown')).toBe(false);
    });

    it('should return true after registration', () => {
      service.register('Hero', StubComponentA);
      expect(service.has('Hero')).toBe(true);
    });
  });
});
