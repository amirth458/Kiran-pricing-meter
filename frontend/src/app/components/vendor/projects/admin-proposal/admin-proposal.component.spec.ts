import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProposalComponent } from './admin-proposal.component';

describe('AdminProposalComponent', () => {
  let component: AdminProposalComponent;
  let fixture: ComponentFixture<AdminProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProposalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
