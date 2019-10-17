import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileScreenerEstimatorComponent } from './profile-screener-estimator.component';

describe('ProfileScreenerEstimatorComponent', () => {
  let component: ProfileScreenerEstimatorComponent;
  let fixture: ComponentFixture<ProfileScreenerEstimatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileScreenerEstimatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileScreenerEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
