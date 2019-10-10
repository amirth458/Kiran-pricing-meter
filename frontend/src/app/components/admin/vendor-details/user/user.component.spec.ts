import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorDetailsUserComponent } from "./vendor-details-user.component";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: AdminVendorDetailsUserComponent;
  let fixture: ComponentFixture<AdminVendorDetailsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminVendorDetailsUserComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/admin/vendor-details/1/'
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVendorDetailsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
