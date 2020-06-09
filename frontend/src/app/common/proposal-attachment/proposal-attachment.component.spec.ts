import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalAttachmentComponent } from './proposal-attachment.component';

describe('ProposalAttachmentComponent', () => {
  let component: ProposalAttachmentComponent;
  let fixture: ComponentFixture<ProposalAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalAttachmentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
