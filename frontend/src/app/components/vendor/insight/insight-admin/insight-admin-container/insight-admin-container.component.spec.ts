import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightAdminContainerComponent } from './insight-admin-container.component';

describe('InsightAdminContainerComponent', () => {
  let component: InsightAdminContainerComponent;
  let fixture: ComponentFixture<InsightAdminContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightAdminContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightAdminContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
