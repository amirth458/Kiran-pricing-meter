import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmSuborderReleaseQueueComponent } from './pm-suborder-release-queue.component';

describe('PmSuborderReleaseQueueComponent', () => {
  let component: PmSuborderReleaseQueueComponent;
  let fixture: ComponentFixture<PmSuborderReleaseQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmSuborderReleaseQueueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmSuborderReleaseQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
