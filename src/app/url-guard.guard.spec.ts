import { TestBed } from '@angular/core/testing';

import { UrlGuard } from './url-guard.guard';

describe('UrlGuardGuard', () => {
  let guard: UrlGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UrlGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
