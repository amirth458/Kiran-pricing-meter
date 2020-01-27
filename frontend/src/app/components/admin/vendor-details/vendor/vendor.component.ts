import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as internationalCode from '../../../../../assets/static/internationalCode';
import { VendorService } from '../../../../service/vendor.service';
import { Vendor, VendorMetaData, Country } from '../../../../model/vendor.model';
import { VendorMetaDataTypes } from '../../../../mockData/vendor';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-vendor-details-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})

export class AdminVendorDetailsVendorComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {

  }
  @ViewChild('modal') modal;
  internationalCode = internationalCode;
  vendorTypes: VendorMetaData[] = [];
  vendorIndustries: VendorMetaData[] = [];
  countries: VendorMetaData[] = [];
  certifications: VendorMetaData[] = [];
  confidentialities: VendorMetaData[] = [];
  selectedCertifications = [];
  phoneUtil = PhoneNumberUtil.getInstance();
  disableConfidentiality = false;
  /*
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });*/
  detailForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    primaryContactFirstName: [null, Validators.required],
    primaryContactLastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required ]],
    vendorType: [{value: '0', disabled: true}, Validators.required],
    vendorIndustry: [{value: '0', disabled: true}],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [{value: '0', disabled: true}, Validators.required],
    street1: [null, Validators.required],
    street2: [null],
    zipCode: [null, [Validators.required, Validators.pattern(/^[0-9\s]{5}$/)]],
    confidentiality: {value: '0', disabled: true},
    vendorCertificates: null
  });

  status = 0;
  vendorId = 0;
  declineComments = '';
  primaryContactName = '';
  async ngOnInit() {
    await this.getVendorMetaDatas();
    try {
      const userId = this.router.url.split('/')[3];
      const res = await this.userService.getUserDetails(userId).toPromise();
      if (res.vendor) {
        this.primaryContactName = res.vendor.primaryContactFirstName + ' ' + res.vendor.primaryContactLastName;
        const vendor = {
          id: res.vendor.id,
          name: res.vendor.name,
          primaryContactFirstName: res.vendor.primaryContactFirstName,
          primaryContactLastName: res.vendor.primaryContactLastName,
          email: res.vendor.email,
          phone: res.vendor.phone,
          vendorType: res.vendor.vendorType,
          vendorIndustries: res.vendor.vendorIndustries,
          city: res.vendor.city,
          state: res.vendor.state,
          country: res.vendor.country,
          street1: res.vendor.street1,
          street2: res.vendor.street2,
          zipCode: res.vendor.zipCode,
          confidentiality: res.vendor.confidentiality,
          vendorCertificates: res.vendor.vendorCertificates
        };

        this.initForm(vendor);
      }
      if (res.vendor) {
        this.vendorId = res.vendor.id;
        if (res.vendor.approved) {
          this.status = 1; // approved
        } else {
          if (res.vendor.approvedAt !== null) {
            this.status = 2; // declined
          } else {
            this.status = 3; // non-approved
          }
        }
      } else {
        this.status = 0; // can't approve, decline
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getVendorMetaDatas() {
    try {
      this.vendorTypes = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorType).toPromise();
      this.countries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Country).toPromise();
      this.vendorIndustries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorIndustry).toPromise();
      this.certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
      this.confidentialities = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Confidentiality).toPromise();
    } catch (e) {

      console.log(e);
    } finally {

    }
  }

  initForm(initValue) {
    this.selectedCertifications = initValue.vendorCertificates;
    this.disableConfidentiality = Number(initValue.confidentiality.id) === 2;

    this.detailForm.setValue({
      id: initValue.id,
      name: initValue.name,
      primaryContactFirstName: initValue.primaryContactFirstName,
      primaryContactLastName: initValue.primaryContactLastName,
      email: initValue.email,
      phone: initValue.phone,
      vendorType: initValue.vendorType.id,
      vendorIndustry: initValue.vendorIndustries[0].id,
      city: initValue.city,
      state: initValue.state,
      country: initValue.country.id,
      street1: initValue.street1 || '',
      street2: initValue.street2 || '',
      zipCode: initValue.zipCode,
      confidentiality: initValue.confidentiality.id || '',
      vendorCertificates: []
    });
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.detailForm.value[field] === '' || this.detailForm.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.detailForm.value[field]) === 0;
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  async approveUser() {
    this.spinner.show();
    try {
      await this.userService.approveUser(this.vendorId).toPromise();
      this.router.navigateByUrl('/user-manage/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not approved. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }

  onDeclineUser(event) {
    this.modal.nativeElement.click();
  }

  async declineUser() {
    if (this.declineComments === '') {
      return;
    }
    this.modal.nativeElement.click();
    this.spinner.show();
    try {
      await this.userService.declineUser(this.vendorId, this.declineComments).toPromise();
      this.router.navigateByUrl('/user-manage/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not declined. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }
}
