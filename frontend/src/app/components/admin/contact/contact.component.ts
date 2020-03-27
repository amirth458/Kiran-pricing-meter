import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/service/customer.service';

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
    phoneNo: ['', [Validators.required]]
  });
  user;
  phoneUtil = PhoneNumberUtil.getInstance();

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public toastrService: ToastrService,
    public customerService: CustomerService
  ) {}

  ngOnInit() {
    this.contactForm.controls.phoneNo.disable();
    let customer: any = localStorage.getItem('viewCustomerInfo');
    if (!customer) {
      this.router.navigateByUrl('/user-manage/customers');
      return;
    }
    customer = JSON.parse(customer);
    this.customerService.getUserById(customer.userId).subscribe(
      (user: any) => {
        this.user = user;
        this.contactForm.setValue({
          ...this.contactForm.value,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNo: user.phoneNo
        });
      },
      err => {
        this.toastrService.error('Something went wrong.');
        console.log(err);
        this.router.navigateByUrl('/user-manage/customers');
      }
    );
  }
}
