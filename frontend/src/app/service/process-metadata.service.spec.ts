import { TestBed } from '@angular/core/testing';

import { ProcessMetadataService } from './process-metadata.service';

describe('ProcessMetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessMetadataService = TestBed.get(ProcessMetadataService);
    expect(service).toBeTruthy();
  });
});
