import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuborderReleaseQueueComponent } from './suborder-release-queue.component';

describe('SuborderReleaseQueueComponent', () => {
  let component: SuborderReleaseQueueComponent;
  let fixture: ComponentFixture<SuborderReleaseQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuborderReleaseQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuborderReleaseQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
