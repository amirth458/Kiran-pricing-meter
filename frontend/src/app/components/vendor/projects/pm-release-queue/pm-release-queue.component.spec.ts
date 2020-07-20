import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmReleaseQueueComponent } from './pm-release-queue.component';

describe('PmReleaseQueueComponent', () => {
  let component: PmReleaseQueueComponent;
  let fixture: ComponentFixture<PmReleaseQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmReleaseQueueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmReleaseQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
