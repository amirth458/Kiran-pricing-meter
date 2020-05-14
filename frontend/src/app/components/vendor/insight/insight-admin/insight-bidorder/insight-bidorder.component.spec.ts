import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightBidorderComponent } from './insight-bidorder.component';

describe('InsightBidorderComponent', () => {
  let component: InsightBidorderComponent;
  let fixture: ComponentFixture<InsightBidorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightBidorderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightBidorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
