import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightRfqComponent } from './insight-rfq.component';

describe('InsightRfqComponent', () => {
  let component: InsightRfqComponent;
  let fixture: ComponentFixture<InsightRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightRfqComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
