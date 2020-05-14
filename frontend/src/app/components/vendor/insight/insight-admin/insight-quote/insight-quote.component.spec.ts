import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightQuoteComponent } from './insight-quote.component';

describe('InsightQuoteComponent', () => {
  let component: InsightQuoteComponent;
  let fixture: ComponentFixture<InsightQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightQuoteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
