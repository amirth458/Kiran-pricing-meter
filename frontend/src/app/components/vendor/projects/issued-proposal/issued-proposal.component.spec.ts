import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedProposalComponent } from './issued-proposal.component';

describe('IssuedProposalComponent', () => {
  let component: IssuedProposalComponent;
  let fixture: ComponentFixture<IssuedProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssuedProposalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
