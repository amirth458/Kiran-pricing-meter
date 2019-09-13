import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as internationalCode from '../../../assets/static/internationalCode';
import { VendorService } from '../../service/vendor.service';
import { Vendor, VendorMetaData } from '../../model/vendor.model';
import { VendorMetaDataTypes } from '../../mockData/vendor';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  internationalCode = internationalCode;
  vendorTypes: VendorMetaData[] = [];
  countries: VendorMetaData[] = [];
  certifications: VendorMetaData[] = [];
  confidentialities: VendorMetaData[] = [];

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
    vendorCertificates: null
  });

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private spineer: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getVendorMetaDatas();
    this.vendorService.getVendorDetail(330).subscribe(res => {
      if (res) {
        this.initForm(res);
      }
    });
  }

  async getVendorMetaDatas() {
    this.spineer.show();
    try {
      this.vendorTypes = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorType).toPromise();
      this.countries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Country).toPromise();
      this.certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
      this.confidentialities = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Confidentiality).toPromise();
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(initValue: Vendor) {
    this.detailForm.setValue({
      id: initValue.id,
      name: initValue.name,
      email: initValue.email,
      phone: initValue.phone,
      vendorType: initValue.vendorType.id,
      city: initValue.city,
      state: initValue.state,
      country: initValue.country.id,
      street: initValue.street1 + (initValue.street2 ? initValue.street2 : ''),
      zipCode: initValue.zipCode,
      confidentiality: initValue.confidentiality.id,
      vendorCertificates: initValue.vendorCertificates.map(cert => cert.id)
    });
  }

  save() {
    this.spineer.show();
    this.vendorService.updateVendorProfile({
      ...this.detailForm.value,
      vendorType: {
        id: this.detailForm.value.vendorType
      },
      country: {
        id: this.detailForm.value.country
      },
      street1: this.detailForm.value.street,
      confidentiality: {
        id: this.detailForm.value.confidentiality
      },
      vendorCertificates: [
        {
          id: this.detailForm.value.vendorCertificates[0]
        }
      ]
    }).subscribe(res => {
      console.log(res);
      this.spineer.hide();
    }, error => {
      console.log(error);
      this.spineer.hide();
    });
  }
}
