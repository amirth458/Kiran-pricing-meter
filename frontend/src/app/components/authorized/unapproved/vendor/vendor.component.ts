import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as internationalCode from '../../../../../assets/static/internationalCode';
import { VendorService } from '../../../../service/vendor.service';
import { Vendor, VendorMetaData, Country } from '../../../../model/vendor.model';
import { VendorMetaDataTypes } from '../../../../mockData/vendor';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unapproved-vendor-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})

export class UnapprovedVendorDetailsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorService,
    private userService: UserService,
  ) {

  }

  internationalCode = internationalCode;
  vendorTypes: VendorMetaData[] = [];
  vendorIndustries: VendorMetaData[] = [];
  countries: VendorMetaData[] = [];
  certifications: VendorMetaData[] = [];
  confidentialities: VendorMetaData[] = [];
  selectedCertifications = [];
  isNewPhone = false;
  phoneUtil = PhoneNumberUtil.getInstance();
  disableConfidentiality = false;

  detailForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    primaryContactFirstName: [null, Validators.required],
    primaryContactLastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required ]],
    vendorType: [null, Validators.required],
    vendorIndustry: [null],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    street1: [null, Validators.required],
    street2: [null],
    zipCode: [null, [Validators.required, Validators.pattern(/^[0-9\s]{5}$/)]],
    confidentiality: null,
    vendorCertificates: null
  });

  ngOnInit() {
    this.getVendorMetaDatas();

    const vendor  = this.userService.getRegisterVendorInfo();
    this.isNewPhone = true;
    if ( vendor ) {
      this.initForm(vendor);
      this.isNewPhone = false;
    }
    this.onValueChanges();
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {

        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  onValueChanges(): void {
    this.detailForm.get('phone').valueChanges.subscribe(val => {
      try {
        const phoneNumber = this.phoneUtil.parseAndKeepRawInput(val);
        const region = this.phoneUtil.getRegionCodeForNumber(phoneNumber);
        if (!region) { return; }
        const selectedCountries = this.internationalCode.filter((country: Country) => country.code === region);
        if (selectedCountries.length === 0) {
          return;
        }
        const { name } = selectedCountries[0];
        const cns = this.countries.filter(country => country.name === name);
        if (cns.length > 0) {
          this.detailForm.patchValue({
            country: cns[0].id
          });
        }
      } catch (e) {
        // console.log(e);
      } finally {

      }
    });
  }

  async getVendorMetaDatas() {
    try {
      const vendorTypes = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorType).toPromise();
      this.countries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Country).toPromise();
      const vendorIndustries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorIndustry).toPromise();
      const certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
      const confidentialities = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Confidentiality).toPromise();

      this.vendorTypes = vendorTypes.map((x) => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return {
          id: x.id,
          name
        };
      });
      this.vendorIndustries = vendorIndustries.map((x) => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return {
          id: x.id,
          name
        };
      });
      this.certifications = certifications.map((x) => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });
      this.confidentialities = confidentialities.map((x) => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });
    } catch (e) {

      console.log(e);
    } finally {

    }
  }

  onChangeConfidentiality(e) {
    this.disableConfidentiality = Number(e.target.value) === 2;
  }

  initForm(initValue: Vendor) {
    this.selectedCertifications = initValue.vendorCertificates.map(x => x.id) || [];
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

  onChangeVendorType(e) {
    if (Number(e.target.value) === 2 || Number(e.target.value) === 6) {
      this.detailForm.setValue({
        ...this.detailForm.value,
        vendorIndustry: 13,
      });

    } else {
      this.detailForm.setValue({
        ...this.detailForm.value,
        vendorIndustry: 0,
      });
    }
  }

  checkDisable(vendorIndustry): boolean {
    const { vendorType } = this.detailForm.value;

    if (Number(vendorType) === 4) {
      return false;
    }
    return ((Number(vendorType) === 2 || Number(vendorType) === 6) && Number(vendorIndustry) !== 13) ||
      ((Number(vendorType) !== 2 && Number(vendorType) !== 6) && Number(vendorIndustry) === 13);
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

  async onSaveVendorInformation(event) {
  }
}
