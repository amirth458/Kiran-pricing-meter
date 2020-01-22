import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessProfileDetailComponent } from './process-profile-detail.component';

describe('ProcessProfileDetailComponent', () => {
  let component: ProcessProfileDetailComponent;
  let fixture: ComponentFixture<ProcessProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
