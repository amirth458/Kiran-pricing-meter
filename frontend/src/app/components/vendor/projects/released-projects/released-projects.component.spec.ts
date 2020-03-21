import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasedProjectsComponent } from './released-projects.component';

describe('ReleasedProjectsComponent', () => {
  let component: ReleasedProjectsComponent;
  let fixture: ComponentFixture<ReleasedProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasedProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
