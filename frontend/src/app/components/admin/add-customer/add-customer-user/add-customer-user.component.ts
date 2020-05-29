import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import * as internationalCode from '../../../../../assets/static/internationalCode';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-customer-user',
  templateUrl: './add-customer-user.component.html',
  styleUrls: ['./add-customer-user.component.css']
})
export class AddCustomerUserComponent implements OnInit {
  contactForm: FormGroup = this.fb.group(
    {
      userEmail: [null, [Validators.required, Validators.email]],
      userFirstName: [null, Validators.required],
      userLastName: [null, Validators.required],
      userPassword: [null, Validators.required],
      confirmPassword: [null],
      userPhoneNo: [null, [Validators.required]]
    },
    { validator: this.checkPasswords }
  );
  phoneUtil = PhoneNumberUtil.getInstance();
  internationalCode = internationalCode;

  constructor(public fb: FormBuilder, public router: Router, public userService: UserService) {}

  checkPasswords(group: FormGroup) {
    const pass = group.get('userPassword').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit() {
    const user = this.userService.getRegisterCustomerInfo();
    if (user) {
      delete user.valid;
      this.contactForm.setValue({ ...user });
    }
  }

  async save(ev) {
    if (!this.contactForm.valid) {
      this.userService.setCustomerRegistrationFormValidity('user', false);
      return;
    }
    this.userService.setCustomerRegistrationFormValidity('user', true);
    this.userService.setRegisterCustomerInfo({ ...this.contactForm.value, valid: this.contactForm.valid });
    this.router.navigateByUrl('/user-manage/add-customer/customer');
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.contactForm.value[field] === '' || this.contactForm.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.contactForm.value[field]) === 0;
    }
  }

  onChange() {
    this.userService.setRegisterCustomerInfo({ ...this.contactForm.value, valid: this.contactForm.valid });
  }
  ngOnDestroy() {
    if (this.contactForm.valid) {
      this.userService.setCustomerRegistrationFormValidity('user', true);
    } else {
      this.userService.setCustomerRegistrationFormValidity('user', false);
    }
  }
}
