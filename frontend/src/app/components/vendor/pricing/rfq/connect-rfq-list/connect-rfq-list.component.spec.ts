import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectRfqListComponent } from './connect-rfq-list.component';

describe('ConnectRfqListComponent', () => {
  let component: ConnectRfqListComponent;
  let fixture: ComponentFixture<ConnectRfqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectRfqListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
