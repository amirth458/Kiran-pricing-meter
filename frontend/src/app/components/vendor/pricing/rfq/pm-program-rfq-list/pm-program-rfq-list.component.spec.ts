import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProgramRfqListComponent } from './pm-program-rfq-list.component';

describe('PmProgramRfqListComponent', () => {
  let component: PmProgramRfqListComponent;
  let fixture: ComponentFixture<PmProgramRfqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmProgramRfqListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmProgramRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
