import { TestBed } from '@angular/core/testing';

import { PostProcessPricingService } from './post-process-pricing.service';

describe('PostProcessPricingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostProcessPricingService = TestBed.get(PostProcessPricingService);
    expect(service).toBeTruthy();
  });
});
