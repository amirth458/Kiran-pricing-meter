import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContainerComponent } from './add-vendor-container.component';

describe('AddVendorContainerComponent', () => {
  let component: AddVendorContainerComponent;
  let fixture: ComponentFixture<AddVendorContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVendorContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
