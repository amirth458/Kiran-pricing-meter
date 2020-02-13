import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingContainerComponent } from './billing-container.component';

describe('BillingContainerComponent', () => {
  let component: BillingContainerComponent;
  let fixture: ComponentFixture<BillingContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
