import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightOrderComponent } from './insight-order.component';

describe('InsightOrderComponent', () => {
  let component: InsightOrderComponent;
  let fixture: ComponentFixture<InsightOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
