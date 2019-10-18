import { TestBed } from '@angular/core/testing';

import { ProfileScreenerService } from './profile-screener.service';

describe('ProfileScreenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileScreenerService = TestBed.get(ProfileScreenerService);
    expect(service).toBeTruthy();
  });
});
