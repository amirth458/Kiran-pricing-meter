import { TestBed } from '@angular/core/testing';

import { RfqPricingService } from './rfq-pricing.service';

describe('RfqPricingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RfqPricingService = TestBed.get(RfqPricingService);
    expect(service).toBeTruthy();
  });
});
