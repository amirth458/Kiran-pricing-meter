import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingChatComponent } from './billing-chat.component';

describe('BillingChatComponent', () => {
  let component: BillingChatComponent;
  let fixture: ComponentFixture<BillingChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillingChatComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
