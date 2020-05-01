import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeMonthComponent } from './date-range-month.component';

describe('DateRangeMonthComponent', () => {
  let component: DateRangeMonthComponent;
  let fixture: ComponentFixture<DateRangeMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateRangeMonthComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
