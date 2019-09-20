import { TestBed } from '@angular/core/testing';

import { ShippingService } from './shipping.service';
import { HttpClientModule } from '@angular/common/http';

describe('ShippingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: ShippingService = TestBed.get(ShippingService);
    expect(service).toBeTruthy();
  });
});
