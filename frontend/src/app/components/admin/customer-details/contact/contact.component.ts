import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/model/customer.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: [''],
    confirmPassword: [''],
    phoneNo: ['', [Validators.required]],
    userLocked: ['', [Validators.required]],
    userActive: ['', [Validators.required]],
    customerActive: ['', [Validators.required]]
  });
  user;
  customer;
  phoneUtil = PhoneNumberUtil.getInstance();

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public toasterService: ToastrService,
    public customerService: CustomerService
  ) {}

  ngOnInit() {
    this.contactForm.controls.phoneNo.disable();
    const customer: any = localStorage.getItem('viewCustomerInfo');

    if (customer) {
      this.customer = JSON.parse(customer);
      this.customerService.getUserById(this.customer.userId).subscribe(
        (user: any) => {
          this.user = user;
          this.contactForm.setValue({
            ...this.contactForm.value,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNo: user.phoneNo,
            userLocked: this.customer.userLocked,
            userActive: this.customer.userActive,
            customerActive: this.customer.customerActive
          });
        },
        err => {
          this.toasterService.error('Something went wrong.');
          console.log(err);
          this.router.navigateByUrl('/user-manage/customers');
        }
      );
    } else if (this.router.url.includes('customers/add')) {
    } else {
      this.router.navigateByUrl('/user-manage/customers');
    }
  }

  onUnlock(customer: Customer = this.customer) {
    this.customerService.unlockCustomer(customer.customerId).subscribe(
      res => {
        this.contactForm.controls.userLocked.setValue(false);
        this.customer.userLocked = false;
        localStorage.setItem('viewCustomerInfo', JSON.stringify(this.customer));
      },
      err => {
        this.toasterService.error('Unable to perform action');
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
        this.toasterService.error('Unable to perform action');
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
        this.toasterService.error('Unable to perform action');
      }
    );
  }
}
