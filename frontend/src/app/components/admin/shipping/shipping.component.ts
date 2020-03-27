import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { CustomerService } from 'src/app/service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  shippingForm: FormGroup = this.fb.group({
    mainAddress: this.fb.group({
      id: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['', Validators.required]
    }),
    otherAddress: this.fb.array([])
  });
  countries = new Set();
  addressTypes = new Set();
  shipping = [];
  constructor(
    public fb: FormBuilder,
    public toastrService: ToastrService,
    public customerService: CustomerService,
    public router: Router
  ) {}

  ngOnInit() {
    let customer: any = localStorage.getItem('viewCustomerInfo');
    if (!customer) {
      this.router.navigateByUrl('/user-manage/customers');
      return;
    }
    customer = JSON.parse(customer);
    this.customerService.getShippingInfo(customer.userId).subscribe(
      (shipping: any) => {
        this.shipping = shipping;
        // set default
        shipping.forEach(item => {
          if (item.country) {
            this.countries.add(item.country);
          }
          if (item.addressType) {
            this.addressTypes.add({
              id: item.addressType.id,
              name: item.addressType.addressType.toString().replace(/_/g, ' ')
            });
          }
          if (item.primary === true) {
            this.shippingForm.setValue({
              ...this.shippingForm.value,
              mainAddress: {
                id: item.id,
                address: item.street1,
                city: item.city,
                state: item.state,
                zipcode: item.zipcode,
                country: item.country.id,
                addressType: item.addressType.id
              }
            });
          } else {
            this.otherAddresses.push(
              this.fb.group({
                id: [item.id],
                address: [item.street1, Validators.required],
                city: [item.city, Validators.required],
                state: [item.state, Validators.required],
                zipcode: [item.zipcode, Validators.required],
                country: [item.country.id, Validators.required],
                addressType: [item.addressType.id, Validators.required]
              })
            );
          }
        });
      },
      err => {
        this.toastrService.error('Something went wrong.');
        console.log(err);
        this.router.navigateByUrl('/user-manage/customers');
      }
    );
    // combineLatest(
    //   this.vendorService.getVendorMetaData('country'),
    //   this.metaDataService.getMetaData('address_type')
    // ).subscribe(([metaCountry, metaAddressType]) => {
    //   this.countries = metaCountry;
    //   this.addressTypes = metaAddressType;
    //   this.shippingService.getShipping().subscribe(shipping => {
    //     // set default
    //     shipping.forEach(item => {
    //       if (item.primary === true) {
    //         this.shippingForm.setValue({
    //           ...this.shippingForm.value,
    //           mainAddress: {
    //             id: item.id,
    //             address: item.street1,
    //             city: item.city,
    //             state: item.state,
    //             zipcode: item.zipcode,
    //             country: item.country.id,
    //             addressType: item.addressType.id
    //           }
    //         });
    //       } else {
    //         this.otherAddresses.push(
    //           this.fb.group({
    //             id: [item.id],
    //             address: [item.street1, Validators.required],
    //             city: [item.city, Validators.required],
    //             state: [item.state, Validators.required],
    //             zipcode: [item.zipcode, Validators.required],
    //             country: [item.country.id, Validators.required],
    //             addressType: [item.addressType.id, Validators.required]
    //           })
    //         );
    //       }
    //     });
    //   });
    // });
  }
  get otherAddresses() {
    return this.shippingForm.get('otherAddress') as FormArray;
  }
}
