import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmReleaseQueueDetailsComponent } from './pm-release-queue-details.component';

describe('PmReleaseQueueDetailsComponent', () => {
  let component: PmReleaseQueueDetailsComponent;
  let fixture: ComponentFixture<PmReleaseQueueDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmReleaseQueueDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmReleaseQueueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
