import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectSettingComponent } from './connect-setting.component';

describe('ConnectSettingComponent', () => {
  let component: ConnectSettingComponent;
  let fixture: ComponentFixture<ConnectSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectSettingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
