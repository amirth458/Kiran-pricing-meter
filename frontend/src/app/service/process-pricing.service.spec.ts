import { TestBed } from '@angular/core/testing';

import { ProcessPricingService } from './process-pricing.service';

describe('ProcessPricingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessPricingService = TestBed.get(ProcessPricingService);
    expect(service).toBeTruthy();
  });
});
