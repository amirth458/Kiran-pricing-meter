import { TestBed } from '@angular/core/testing';

import { PricingMetadataService } from './pricing-metadata.service';

describe('PricingMetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PricingMetadataService = TestBed.get(PricingMetadataService);
    expect(service).toBeTruthy();
  });
});
