import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCustomersComponent } from './insight-customers.component';

describe('InsightCustomersComponent', () => {
  let component: InsightCustomersComponent;
  let fixture: ComponentFixture<InsightCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightCustomersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
