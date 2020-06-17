import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherStatusComponent } from './other-status.component';

describe('OtherStatusComponent', () => {
  let component: OtherStatusComponent;
  let fixture: ComponentFixture<OtherStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OtherStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
