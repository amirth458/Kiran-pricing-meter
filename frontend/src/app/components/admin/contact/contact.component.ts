import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import * as internationalCode from '../../../../assets/static/internationalCode';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      phoneNo: ['', [Validators.required]]
    },
    { validator: this.checkPasswords }
  );
  user;
  phoneUtil = PhoneNumberUtil.getInstance();
  internationalCode = internationalCode;

  constructor(public fb: FormBuilder, public router: Router, public toastrService: ToastrService) {}

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit() {
    // this.user = user;
    // this.contactForm.setValue({
    //   ...this.contactForm.value,
    //   email: user.email,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   phoneNo: user.phoneNo
    // });
  }

  handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.contactForm.value[field] === '' || this.contactForm.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.contactForm.value[field]) === 0;
    }
  }

  onChange() {
    localStorage.setItem('procurement-settingChanged', 'true');
  }
}
