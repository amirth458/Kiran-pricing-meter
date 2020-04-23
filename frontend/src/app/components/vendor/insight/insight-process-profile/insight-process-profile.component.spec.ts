import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightProcessProfileComponent } from './insight-process-profile.component';

describe('InsightProcessProfileComponent', () => {
  let component: InsightProcessProfileComponent;
  let fixture: ComponentFixture<InsightProcessProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightProcessProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightProcessProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
