import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightPartComponent } from './insight-part.component';

describe('InsightPartComponent', () => {
  let component: InsightPartComponent;
  let fixture: ComponentFixture<InsightPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightPartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
