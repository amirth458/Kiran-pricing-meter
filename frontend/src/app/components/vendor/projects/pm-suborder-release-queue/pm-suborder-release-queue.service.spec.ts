import { TestBed } from '@angular/core/testing';

import { PmSuborderReleaseQueueService } from './pm-suborder-release-queue.service';

describe('PmSuborderReleaseQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmSuborderReleaseQueueService = TestBed.get(PmSuborderReleaseQueueService);
    expect(service).toBeTruthy();
  });
});
