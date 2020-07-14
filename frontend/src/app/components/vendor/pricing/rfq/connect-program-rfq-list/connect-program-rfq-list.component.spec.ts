import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectProgramRfqListComponent } from './connect-program-rfq-list.component';

describe('ConnectProgramRfqListComponent', () => {
  let component: ConnectProgramRfqListComponent;
  let fixture: ComponentFixture<ConnectProgramRfqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectProgramRfqListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectProgramRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
