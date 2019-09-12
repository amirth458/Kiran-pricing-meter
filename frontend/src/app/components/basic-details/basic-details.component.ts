import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as internationalCode from '../../../assets/static/internationalCode';
import { VendorService } from '../../service/vendor.service';
import { VendorDetail } from '../../model/vendor.model';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  internationalCode = internationalCode;
  certificationsOption = [];
  confidentialityOption = [];

  detailForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    email: [null, Validators.required],
    phone: [null, Validators.required],
    vendorType: [null, Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    street: [null, Validators.required],
    zipCode: [null, Validators.required],
    confidentiality: null,
    certification: null
  });

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService
  ) { }

  ngOnInit() {
    this.vendorService.getVendorDetail(330).subscribe(res => {
      if (res) {
        this.initForm(res);
      }
    });
  }

  initForm(initValue: VendorDetail) {
    this.detailForm.setValue({
      id: initValue.id,
      name: initValue.name,
      email: initValue.email,
      phone: initValue.phone,
      vendorType: initValue.vendorType,
      city: initValue.city,
      state: initValue.state,
      country: initValue.country,
      street: initValue.street1 + initValue.street2,
      zipCode: initValue.zipCode,
      confidentiality: initValue.confidentiality,
      certification: null
    });
  }

  save() {
    console.log(this.detailForm.value);
  }
}
