import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-vendor-details-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class AdminVendorDetailsUserComponent implements OnInit, AfterViewChecked {
  form: FormGroup = this.fb.group({
    email: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    phone: [null, Validators.required],
    company: [null, Validators.required],
    department: [null],
  });
  status = 0;
  vendorId = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    try {
      const userId = this.router.url.split('/')[3];
      const res = await this.userService.getUserDetails(userId).toPromise();
      const user = {
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        company: res.companyName,
        department: res.department,
        phone: res.phoneNo,
      };
      this.initUser(user);
      if (res.vendor) {
        this.vendorId = res.vendor.id;
        if (res.vendor.approved) {
          this.status = 1; // approved
        } else {
          if (res.vendor.approvedAt !== null) {
            this.status = 2; // declined
          } else {
            this.status = 3; // non-approved
          }
        }
      } else {
        this.status = 0; // can't approve, decline
      }
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
  }

  initUser(user): void {
    this.form.setValue({
      ...user
    });
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.form.value[field] === '' || this.form.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.form.value[field]) === 0;
    }
  }

  samePassword() {
    if (this.form.value.passwordConfirm !== '' && this.form.value.passwordConfirm !== null) {
      if (this.form.value.password !== this.form.value.passwordConfirm) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async approveUser() {
    this.spinner.show();
    try {
      await this.userService.approveUser(this.vendorId).toPromise();
      this.router.navigateByUrl('/admin/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not approved. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }

  async declineUser() {
    this.spinner.show();
    try {
      await this.userService.declineUser(this.vendorId).toPromise();
      this.router.navigateByUrl('/admin/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not declined. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }
}
