import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightVendorsComponent } from './insight-vendors.component';

describe('InsightVendorsComponent', () => {
  let component: InsightVendorsComponent;
  let fixture: ComponentFixture<InsightVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightVendorsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
