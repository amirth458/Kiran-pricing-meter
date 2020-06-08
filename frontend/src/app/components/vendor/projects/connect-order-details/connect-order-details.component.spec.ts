import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectOrderDetailsComponent } from './connect-order-details.component';

describe('ConnectOrderDetailsComponent', () => {
  let component: ConnectOrderDetailsComponent;
  let fixture: ComponentFixture<ConnectOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectOrderDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
