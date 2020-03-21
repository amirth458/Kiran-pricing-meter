import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorConfirmationQueueComponent } from './vendor-confirmation-queue.component';

describe('VendorConfirmationQueueComponent', () => {
  let component: VendorConfirmationQueueComponent;
  let fixture: ComponentFixture<VendorConfirmationQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorConfirmationQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorConfirmationQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
