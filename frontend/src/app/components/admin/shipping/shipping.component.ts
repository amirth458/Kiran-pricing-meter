import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { throwError, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  countries;
  addressTypes;

  constructor(public fb: FormBuilder, public toastrService: ToastrService) {}

  ngOnInit() {
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

  handleHttpError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  // tslint:disable-next-line:no-unnecessary-initializer
  showRequired(field: string, index: number = undefined) {
    if (index === undefined) {
      return this.shippingForm.value.mainAddress[field] === '' || this.shippingForm.value.mainAddress[field] === '';
    } else {
      return (
        this.shippingForm.value.otherAddress[index][field] === '' ||
        this.shippingForm.value.otherAddress[index][field] === ''
      );
    }
  }
  get otherAddresses() {
    return this.shippingForm.get('otherAddress') as FormArray;
  }
  addAddress() {
    this.otherAddresses.push(
      this.fb.group({
        id: [''],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required],
        country: ['', Validators.required],
        addressType: ['', Validators.required]
      })
    );
    this.onChange();
  }
  removeAddress(index: number) {
    this.otherAddresses.removeAt(index);
    this.onChange();
  }

  onChange() {
    localStorage.setItem('procurement-settingChanged', 'true');
  }
}
