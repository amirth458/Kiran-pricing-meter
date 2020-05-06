import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReleasedOrdersComponent } from './production-released-orders.component';

describe('ProductionReleasedOrdersComponent', () => {
  let component: ProductionReleasedOrdersComponent;
  let fixture: ComponentFixture<ProductionReleasedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionReleasedOrdersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionReleasedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
