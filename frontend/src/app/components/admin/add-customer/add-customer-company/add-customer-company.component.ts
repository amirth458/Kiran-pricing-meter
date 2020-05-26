import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Observable, throwError, of } from 'rxjs';

import { PhoneNumberUtil } from 'google-libphonenumber';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { VendorService } from 'src/app/service/vendor.service';
import { UserService } from 'src/app/service/user.service';
import * as internationalCode from '../../../../../assets/static/internationalCode';

@Component({
  selector: 'app-add-customer-company',
  templateUrl: './add-customer-company.component.html',
  styleUrls: ['./add-customer-company.component.css']
})
export class AddCustomerCompanyComponent implements OnInit {
  contactForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    division: [null],
    industries: [null, Validators.required],
    phoneNo: [null, [Validators.required]],
    promoCode: [null, null, [this.validatePromoCode()]]
  });
  industries: any[] = [];
  vendorIndustries: { id: number; name: any }[];
  phoneUtil = PhoneNumberUtil.getInstance();
  internationalCode = internationalCode;

  constructor(
    public fb: FormBuilder,
    public vendorService: VendorService,
    public userService: UserService,
    public toastrService: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getMetaData();
  }

  async getMetaData() {
    const vendorIndustries = await this.vendorService.getVendorMetaData('vendor_industries').toPromise();
    this.vendorIndustries = vendorIndustries.map(x => {
      const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
      return {
        id: x.id,
        name
      };
    });
    const contactData = this.userService.getRegisterContactInfo();
    if (contactData) {
      delete contactData.valid;
      this.contactForm.setValue({ ...contactData });
      this.industries = this.contactForm.value.industries;
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  validatePromoCode(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return control.value
        ? this.userService.validatePromoCode(control.value).pipe(map(v => (v ? null : { invalidPromoCode: true })))
        : of(null);
    };
  }

  async save(event) {
    this.userService.setRegisterContactInfo({
      ...this.contactForm.value,
      valid: this.contactForm.valid
    });
    const customerData = this.userService.getRegisterCustomerInfo();
    const contactData = this.userService.getRegisterContactInfo();
    if (customerData.valid && contactData.valid) {
      const data = {
        userEmail: customerData && customerData.userEmail,
        userPassword: customerData && customerData.userPassword,
        userFirstName: customerData && customerData.userFirstName,
        userLastName: customerData && customerData.userLastName,
        userPhoneNo: customerData && customerData.userPhoneNo,
        name: contactData && contactData.name,
        phoneNo: contactData && contactData.phoneNo,
        division: contactData && contactData.division,
        industries:
          contactData &&
          contactData.industries.map(industry => ({
            id: industry
          })),
        promotionalCode: contactData.promoCode || null
      };
      this.userService.setCustomerRegistrationFormValidity('contact', true);
      this.userService
        .registerCustomer(data)
        .pipe(catchError(e => this.handleError(e)))
        .subscribe(() => {
          window.localStorage.removeItem('procurement-RegisterContact');
          window.localStorage.removeItem('procurement-RegisterCustomer');
          this.router.navigateByUrl('/user-manage/customers');
        });
    } else {
      this.userService.setCustomerRegistrationFormValidity('contact', false);
    }
  }

  handleError(error: HttpErrorResponse) {
    let message = '';
    if (error && error.error && (error.error.message || '').indexOf('Account already exist') > -1) {
      message = 'Email Address already exist';
    } else {
      message = `${error.error.message} Please contact your admin`;
    }
    this.toastrService.error(message);
    return throwError(message);
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return (
        this.contactForm.value[field] === '' ||
        this.contactForm.value[field] === null ||
        (this.contactForm.value[field] instanceof Array && (this.contactForm.value[field] || []).length === 0)
      );
    } else if (fieldType === 2) {
      return Number(this.contactForm.value[field]) === 0;
    }
  }

  onChange() {
    this.contactForm.setValue({
      ...this.contactForm.value,
      industries: this.industries
    });
    this.userService.setRegisterContactInfo({
      ...this.contactForm.value,
      valid: this.contactForm.valid
    });
  }

  ngOnDestroy() {
    if (this.contactForm.valid) {
      this.userService.setCustomerRegistrationFormValidity('contact', true);
    } else {
      this.userService.setCustomerRegistrationFormValidity('contact', false);
    }
  }
}
