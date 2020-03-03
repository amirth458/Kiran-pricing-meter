import { TestBed } from '@angular/core/testing';

import { PartNoteService } from './part-note.service';

describe('PartNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartNoteService = TestBed.get(PartNoteService);
    expect(service).toBeTruthy();
  });
});
