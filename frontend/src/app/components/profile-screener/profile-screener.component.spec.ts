import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileScreenerComponent } from './profile-screener.component';

describe('ProfileScreenerComponent', () => {
  let component: ProfileScreenerComponent;
  let fixture: ComponentFixture<ProfileScreenerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileScreenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileScreenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
