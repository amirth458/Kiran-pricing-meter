import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightPartInformationComponent } from './insight-part-information.component';

describe('InsightPartInformationComponent', () => {
  let component: InsightPartInformationComponent;
  let fixture: ComponentFixture<InsightPartInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightPartInformationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightPartInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
