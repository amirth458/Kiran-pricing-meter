import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightVendorContainerComponent } from './insight-vendor-container.component';

describe('InsightVendorContainerComponent', () => {
  let component: InsightVendorContainerComponent;
  let fixture: ComponentFixture<InsightVendorContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsightVendorContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightVendorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
