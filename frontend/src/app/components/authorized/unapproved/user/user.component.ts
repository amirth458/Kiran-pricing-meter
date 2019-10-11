import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unapproved-vendor-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UnapprovedVendorUserComponent implements OnInit, AfterViewChecked {
  form: FormGroup = this.fb.group({
    email: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    phone: [null, Validators.required],
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
      const res = this.userService.getUserInfo();
      const user = {
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
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

  async onSaveUserInformation(event) {
    this.router.navigateByUrl('/profile/unapproved/vendor');
  }
}
