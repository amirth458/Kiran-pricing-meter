import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPartComponent } from './connect-part.component';

describe('ConnectPartComponent', () => {
  let component: ConnectPartComponent;
  let fixture: ComponentFixture<ConnectPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectPartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
