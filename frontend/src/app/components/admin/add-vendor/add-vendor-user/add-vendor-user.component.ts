import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';
import { Validator } from 'src/app/util/Validator';

@Component({
  selector: 'app-add-vendor-user',
  templateUrl: './add-vendor-user.component.html',
  styleUrls: ['./add-vendor-user.component.css']
})
export class AddVendorUserComponent implements OnInit {
  isLoadedUser = false;
  errorMessage = '';
  submitted = false;

  public form: FormGroup = this.fb.group(
    {
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, Validators.required],
      phone: [null, Validators.required]
    },
    {
      validator: Validator.match('password', 'confirmPassword')
    }
  );

  constructor(private router: Router, public userService: UserService, public fb: FormBuilder) {}

  ngOnInit() {
    const user: RegisterUser = this.userService.getRegisterUserInfo();
    if (user) {
      this.isLoadedUser = true;
      setTimeout(() => {
        this.initUser(user);
        this.apply();
      }, 0);
    }
  }
  ngOnDestroy() {
    const user: RegisterUser = {
      ...this.form.value
    };
    this.userService.setRegisterUserInfo(user);
    if (this.form.valid) {
      this.userService.setVendorRegistrationFormValidity('user', true);
    } else {
      this.userService.setVendorRegistrationFormValidity('user', false);
    }
  }

  get controls() {
    return this.form.controls;
  }

  apply() {
    const user: RegisterUser = {
      ...this.form.value
    };
    this.userService.setRegisterUserInfo(user);
    if (this.isLoadedUser && !this.form.valid) {
      setTimeout(() => {
        this.submitted = true;
        this.userService.setUserFormStatus(this.form.valid ? 1 : 0);
      }, 0);
    }
  }

  initUser(user: RegisterUser): void {
    this.form.setValue({
      ...user
    });
  }

  onSaveUserInformation(event) {
    this.errorMessage = '';
    this.submitted = true;
    if (this.form.valid) {
      this.userService.setVendorRegistrationFormValidity('user', true);
      this.apply();
      this.router.navigateByUrl('/user-manage/add-vendor/vendor');
    } else {
      this.userService.setVendorRegistrationFormValidity('user', false);
    }
  }
}
