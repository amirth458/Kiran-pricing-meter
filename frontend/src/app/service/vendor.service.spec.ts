import { TestBed } from '@angular/core/testing';

import { VendorService } from './vendor.service';
import { HttpClientModule } from '@angular/common/http';

describe('VendorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: VendorService = TestBed.get(VendorService);
    expect(service).toBeTruthy();
  });
});
