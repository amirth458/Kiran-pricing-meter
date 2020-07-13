import { TestBed } from '@angular/core/testing';

import { ProcessProfileService } from './process-profile.service';

describe('ProcessProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessProfileService = TestBed.get(ProcessProfileService);
    expect(service).toBeTruthy();
  });
});
