import { ToastrService } from 'ngx-toastr';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import * as internationalCode from '../../../../assets/static/internationalCode';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit, OnDestroy {
  contactForm: FormGroup = this.fb.group({
    name: [''],
    division: [''],
    industries: [''],
    phoneNo: ['']
  });
  industries: any[] = [];
  vendorIndustries: { id: number; name: any }[];
  phoneUtil = PhoneNumberUtil.getInstance();
  internationalCode = internationalCode;

  constructor(public fb: FormBuilder, public toastrService: ToastrService) {}

  ngOnInit() {
    this.getMetaData();
  }

  ngOnDestroy() {}

  async getMetaData() {
    // const vendorIndustries = await this.vendorService
    //   .getVendorMetaData('vendor_industries')
    //   .toPromise();
    // this.vendorIndustries = vendorIndustries.map(x => {
    //   const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
    //   return {
    //     id: x.id,
    //     name
    //   };
    // });
    // this.userService.getCustomerInfo().subscribe((contactData: any) => {
    //   this.industries = contactData.industries
    //     ? contactData.industries.map(item => item.id)
    //     : [];
    //   this.contactForm.setValue({
    //     name: contactData.name,
    //     division: contactData.division,
    //     phoneNo: contactData.phoneNo,
    //     industries: this.industries
    //   });
    // });
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  handleHttpError(error: HttpErrorResponse) {
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
