import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorDetailsComponent } from './vendor-details.component';
import { ActionBarComponent } from 'src/app/common/action-bar/action-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminVendorDetailsComponent', () => {
  let component: AdminVendorDetailsComponent;
  let fixture: ComponentFixture<AdminVendorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVendorDetailsComponent, ActionBarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
