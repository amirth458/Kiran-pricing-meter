import { TestBed } from '@angular/core/testing';

import { PostProcessProfileService } from './post-process-profile.service';

describe('PostProcessProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostProcessProfileService = TestBed.get(PostProcessProfileService);
    expect(service).toBeTruthy();
  });
});
