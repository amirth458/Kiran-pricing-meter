import { TestBed } from '@angular/core/testing';

import { LinkVendorService } from './link-vendor.service';

describe('LinkVendorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkVendorService = TestBed.get(LinkVendorService);
    expect(service).toBeTruthy();
  });
});
