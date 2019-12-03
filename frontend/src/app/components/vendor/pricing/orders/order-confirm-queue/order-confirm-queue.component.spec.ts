import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmQueueComponent } from './order-confirm-queue.component';

describe('OrderConfirmQueueComponent', () => {
  let component: OrderConfirmQueueComponent;
  let fixture: ComponentFixture<OrderConfirmQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderConfirmQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
