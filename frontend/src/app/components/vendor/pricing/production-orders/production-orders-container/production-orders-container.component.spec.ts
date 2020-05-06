import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrdersContainerComponent } from './production-orders-container.component';

describe('ProductionOrdersContainerComponent', () => {
  let component: ProductionOrdersContainerComponent;
  let fixture: ComponentFixture<ProductionOrdersContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionOrdersContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrdersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
