import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPartQuoteComponent } from './customer-part-quote.component';

describe('CustomerPartQuoteComponent', () => {
  let component: CustomerPartQuoteComponent;
  let fixture: ComponentFixture<CustomerPartQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPartQuoteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPartQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
