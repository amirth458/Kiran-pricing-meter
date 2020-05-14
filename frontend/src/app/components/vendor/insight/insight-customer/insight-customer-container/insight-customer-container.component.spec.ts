import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCustomerContainerComponent } from './insight-customer-container.component';

describe('InsightCustomerContainerComponent', () => {
  let component: InsightCustomerContainerComponent;
  let fixture: ComponentFixture<InsightCustomerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightCustomerContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightCustomerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
