import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderStatusComponent } from './vendor-order-status.component';

describe('VendorOrderStatusComponent', () => {
  let component: VendorOrderStatusComponent;
  let fixture: ComponentFixture<VendorOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VendorOrderStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
