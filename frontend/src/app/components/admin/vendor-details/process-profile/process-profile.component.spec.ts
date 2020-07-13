import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorProcessProfileComponent } from './process-profile.component';

describe('AdminVendorProcessProfileComponent', () => {
  let component: AdminVendorProcessProfileComponent;
  let fixture: ComponentFixture<AdminVendorProcessProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVendorProcessProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVendorProcessProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
