import { ToastrService } from 'ngx-toastr';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as internationalCode from '../../../../../assets/static/internationalCode';
import { CustomerService } from 'src/app/service/customer.service';
import { Router } from '@angular/router';
import { Customer } from 'src/app/model/customer.model';

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
    phoneNo: [''],
    userLocked: ['', [Validators.required]],
    userActive: ['', [Validators.required]],
    customerActive: ['', [Validators.required]]
  });
  industries: any[] = [];
  vendorIndustries: { id: number; name: any }[];
  phoneUtil = PhoneNumberUtil.getInstance();
  internationalCode = internationalCode;
  customer;

  constructor(
    public fb: FormBuilder,
    public toastrService: ToastrService,
    public customerService: CustomerService,
    public router: Router
  ) {}

  ngOnInit() {
    this.contactForm.controls.phoneNo.disable();
    this.contactForm.controls.industries.disable();

    const customer: any = localStorage.getItem('viewCustomerInfo');
    if (!customer) {
      this.router.navigateByUrl('/user-manage/customers');
      return;
    }
    this.customer = JSON.parse(customer);
    this.customerService.getCustomerById(this.customer.customerId).subscribe(
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
          industries: this.industries,
          userLocked: this.customer.userLocked,
          userActive: this.customer.userActive,
          customerActive: this.customer.customerActive
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

  onUnlock(customer: Customer = this.customer) {
    this.customerService.unlockCustomer(customer.customerId).subscribe(
      res => {
        this.contactForm.controls.userLocked.setValue(false);
        this.customer.userLocked = false;
        localStorage.setItem('viewCustomerInfo', JSON.stringify(this.customer));
      },
      err => {
        this.toastrService.error('Unable to perform action');
      }
    );
  }

  onActivate(customer: Customer = this.customer) {
    this.customerService.activateCustomer(customer.customerId).subscribe(
      res => {
        this.contactForm.controls.customerActive.setValue(true);
        this.customer.customerActive = true;
        localStorage.setItem('viewCustomerInfo', JSON.stringify(this.customer));
      },
      err => {
        this.toastrService.error('Unable to perform action');
      }
    );
  }
  onDeactivate(customer: Customer = this.customer) {
    this.customerService.deactivateCustomer(customer.customerId).subscribe(
      res => {
        this.contactForm.controls.customerActive.setValue(false);
        this.customer.customerActive = false;
        localStorage.setItem('viewCustomerInfo', JSON.stringify(this.customer));
      },
      err => {
        this.toastrService.error('Unable to perform action');
      }
    );
  }
}
