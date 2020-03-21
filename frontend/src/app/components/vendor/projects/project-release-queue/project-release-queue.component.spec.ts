import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReleaseQueueComponent } from './project-release-queue.component';

describe('ProjectReleaseQueueComponent', () => {
  let component: ProjectReleaseQueueComponent;
  let fixture: ComponentFixture<ProjectReleaseQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectReleaseQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReleaseQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
