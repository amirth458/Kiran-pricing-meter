import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightContainerComponent } from './insight-container.component';

describe('InsightContainerComponent', () => {
  let component: InsightContainerComponent;
  let fixture: ComponentFixture<InsightContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
