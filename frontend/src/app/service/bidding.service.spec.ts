import { TestBed } from '@angular/core/testing';

import { BiddingService } from './bidding.service';

describe('BiddingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BiddingService = TestBed.get(BiddingService);
    expect(service).toBeTruthy();
  });
});
