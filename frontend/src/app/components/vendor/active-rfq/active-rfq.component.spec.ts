import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRfqComponent } from './active-rfq.component';

describe('ActiveRfqComponent', () => {
  let component: ActiveRfqComponent;
  let fixture: ComponentFixture<ActiveRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
