import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalBidComponent } from './historical-bid.component';

describe('HistoricalBidComponent', () => {
  let component: HistoricalBidComponent;
  let fixture: ComponentFixture<HistoricalBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalBidComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
