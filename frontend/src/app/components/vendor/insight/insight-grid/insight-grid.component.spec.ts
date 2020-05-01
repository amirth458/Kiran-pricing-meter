import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightGridComponent } from './insight-grid.component';

describe('InsightGridComponent', () => {
  let component: InsightGridComponent;
  let fixture: ComponentFixture<InsightGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightGridComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
