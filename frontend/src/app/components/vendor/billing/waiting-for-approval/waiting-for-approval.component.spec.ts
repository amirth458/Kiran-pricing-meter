import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForApprovalComponent } from './waiting-for-approval.component';

describe('WaitingForApprovalComponent', () => {
  let component: WaitingForApprovalComponent;
  let fixture: ComponentFixture<WaitingForApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingForApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
