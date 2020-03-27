import { ToastrService } from 'ngx-toastr';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as internationalCode from '../../../../assets/static/internationalCode';
import { CustomerService } from 'src/app/service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
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

  constructor(
    public fb: FormBuilder,
    public toastrService: ToastrService,
    public customerService: CustomerService,
    public router: Router
  ) {}

  ngOnInit() {
    this.contactForm.controls.phoneNo.disable();
    this.contactForm.controls.industries.disable();

    let customer: any = localStorage.getItem('viewCustomerInfo');
    if (!customer) {
      this.router.navigateByUrl('/user-manage/customers');
      return;
    }
    customer = JSON.parse(customer);
    this.customerService.getCustomerById(customer.customerId).subscribe(
      (contactData: any) => {
        this.industries = contactData.industries ? contactData.industries.map(item => item.id) : [];
        this.vendorIndustries = contactData.industries
          ? contactData.industries.map(x => {
              const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
              return {
                id: x.id,
                name
              };
            })
          : [];
        this.contactForm.setValue({
          name: contactData.name,
          division: contactData.division,
          phoneNo: contactData.phoneNo,
          industries: this.industries
        });
      },
      err => {
        this.toastrService.error('Something went wrong.');
        console.log(err);
        this.router.navigateByUrl('/user-manage/customers');
      }
    );
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }
}
