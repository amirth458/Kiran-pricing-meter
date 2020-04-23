import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightBidComponent } from './insight-bid.component';

describe('InsightBidComponent', () => {
  let component: InsightBidComponent;
  let fixture: ComponentFixture<InsightBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightBidComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
