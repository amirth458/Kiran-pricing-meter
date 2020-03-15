import { TestBed } from '@angular/core/testing';

import { ForgeService } from './forge.service';

describe('ForgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgeService = TestBed.get(ForgeService);
    expect(service).toBeTruthy();
  });
});
