import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightBidorderitemComponent } from './insight-bidorderitem.component';

describe('InsightBidorderitemComponent', () => {
  let component: InsightBidorderitemComponent;
  let fixture: ComponentFixture<InsightBidorderitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightBidorderitemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightBidorderitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
