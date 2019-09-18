import { TestBed } from '@angular/core/testing';

import { PreferenceService } from './preference.service';
import { HttpClientModule } from '@angular/common/http';

describe('PreferenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: PreferenceService = TestBed.get(PreferenceService);
    expect(service).toBeTruthy();
  });
});
