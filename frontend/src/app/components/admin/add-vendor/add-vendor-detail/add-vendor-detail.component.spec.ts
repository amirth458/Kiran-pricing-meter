import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorDetailComponent } from './add-vendor-detail.component';

describe('AddVendorDetailComponent', () => {
  let component: AddVendorDetailComponent;
  let fixture: ComponentFixture<AddVendorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
