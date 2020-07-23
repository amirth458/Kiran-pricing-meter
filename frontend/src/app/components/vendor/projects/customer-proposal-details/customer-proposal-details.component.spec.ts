import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProposalDetailsComponent } from './customer-proposal-details.component';

describe('CustomerProposalDetailsComponent', () => {
  let component: CustomerProposalDetailsComponent;
  let fixture: ComponentFixture<CustomerProposalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerProposalDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProposalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
