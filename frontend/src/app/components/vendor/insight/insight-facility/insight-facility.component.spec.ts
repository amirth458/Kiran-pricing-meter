import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightFacilityComponent } from './insight-facility.component';

describe('InsightFacilityComponent', () => {
  let component: InsightFacilityComponent;
  let fixture: ComponentFixture<InsightFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightFacilityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
