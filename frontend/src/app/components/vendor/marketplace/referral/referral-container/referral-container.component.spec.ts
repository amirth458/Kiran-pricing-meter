import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralContainerComponent } from './referral-container.component';

describe('ReferralContainerComponent', () => {
  let component: ReferralContainerComponent;
  let fixture: ComponentFixture<ReferralContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReferralContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
