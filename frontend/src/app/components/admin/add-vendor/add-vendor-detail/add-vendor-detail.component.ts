import { Component, OnInit } from '@angular/core';
import { Vendor, VendorMetaData, Country } from 'src/app/model/vendor.model';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { PhoneNumberUtil } from 'google-libphonenumber';

import ZipRegs from 'src/assets/static/zipRegs.js';
import { environment } from 'src/environments/environment';

import { VendorService } from 'src/app/service/vendor.service';
import { UserService } from 'src/app/service/user.service';

import * as internationalCode from '../../../../../assets/static/internationalCode';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';

@Component({
  selector: 'app-add-vendor-detail',
  templateUrl: './add-vendor-detail.component.html',
  styleUrls: ['./add-vendor-detail.component.css']
})
export class AddVendorDetailComponent implements OnInit {
  constructor(
    private router: Router,
    public vendorService: VendorService,
    public userService: UserService,
    public fb: FormBuilder
  ) {}

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
  agreementUrl = environment.agreementUrl;
  isValid = false;
  submitted = false;

  public form: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    primaryContactFirstName: [null, Validators.required],
    primaryContactLastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    vendorType: [null, Validators.required],
    vendorIndustry: [null],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    street1: [null, Validators.required],
    street2: [null],
    zipCode: [null, [Validators.required]],
    confidentiality: null,
    vendorCertificates: null
  });

  ngOnInit() {
    this.getVendorMetaDatas();
    const userInfo = this.userService.getRegisterUserInfo();

    const vendor = this.userService.getRegisterVendorInfo();
    this.isNewPhone = true;
    if (vendor) {
      this.initForm(vendor);
      this.isNewPhone = false;
    } else {
      const user = this.userService.getRegisterUserInfo();
      if (user) {
        this.form.patchValue({
          primaryContactFirstName: user.firstName,
          primaryContactLastName: user.lastName,
          email: user.email,
          phone: user.phone
        });
      }
    }
    this.onValueChanges();
  }

  zipRegs = ZipRegs;
  zipPattern;

  onCountryChange(ev) {
    const country = ev.target.selectedOptions[0].text;
    this.zipPattern = this.zipRegs[country];
    //this.zipCode.setAttribute('pattern', zipRegs[country]);
  }

  ngOnDestroy() {
    this.saveInformation();
    if (this.form.valid) {
      this.userService.setVendorRegistrationFormValidity('vendor', true);
    } else {
      this.userService.setVendorRegistrationFormValidity('vendor', false);
    }
  }

  ngAfterViewChecked(): void {}

  saveInformation() {
    const vendorProfile = {
      ...this.form.value,
      vendorType: {
        id: this.form.value.vendorType
      },
      vendorIndustry: {
        id: this.form.value.vendorIndustry
      },
      country: {
        id: this.form.value.country
      },
      confidentiality: {
        id: this.form.value.confidentiality
      },
      vendorCertificates: this.certifications.filter(item => this.selectedCertifications.includes(item.id)),
      vendorIndustries: [
        {
          id: this.form.value.vendorIndustry
        }
      ]
    };
    this.userService.setRegisterVendorInfo(vendorProfile);
  }

  onValueChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.saveInformation();

      if (this.isValid !== this.form.valid) {
        this.isValid = this.form.valid;
        this.userService.setVendorFormStatus(this.form.valid ? 1 : 0);
      }
    });

    this.form.get('phone').valueChanges.subscribe(val => {
      try {
        const phoneNumber = this.phoneUtil.parseAndKeepRawInput(val);
        const region = this.phoneUtil.getRegionCodeForNumber(phoneNumber);
        if (!region) {
          return;
        }
        const selectedCountries = this.internationalCode.filter((country: Country) => country.code === region);
        if (selectedCountries.length === 0) {
          return;
        }
        const { name } = selectedCountries[0];
        const cns = this.countries.filter(country => country.name === name);
        if (cns.length > 0) {
          this.form.patchValue({
            country: cns[0].id
          });
          this.zipPattern = this.zipRegs[name];
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
      const vendorIndustries = await this.vendorService
        .getVendorMetaData(VendorMetaDataTypes.VendorIndustry)
        .toPromise();
      const certifications = await this.vendorService
        .getVendorMetaData(VendorMetaDataTypes.FacilityCertificate)
        .toPromise();
      const confidentialities = await this.vendorService
        .getVendorMetaData(VendorMetaDataTypes.Confidentiality)
        .toPromise();

      this.vendorTypes = vendorTypes.map(x => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return {
          id: x.id,
          name
        };
      });
      this.vendorIndustries = vendorIndustries.map(x => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return {
          id: x.id,
          name
        };
      });
      this.certifications = certifications.map(x => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });
      this.confidentialities = confidentialities.map(x => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });

      const initConfidentiality = this.confidentialities.filter(item => item.name === 'Yes');
      if (initConfidentiality.length) {
        this.form.controls.confidentiality.setValue(initConfidentiality[0].id);
      }

      const country = this.countries.find(country => country.id === parseInt(this.form.value.country));
      if (country) {
        this.zipPattern = this.zipRegs[country.name];
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  onChangeConfidentiality(e) {
    // this.disableConfidentiality = Number(e.target.value) === 2;
  }

  get controls() {
    return this.form.controls;
  }

  initForm(initValue: Vendor) {
    this.selectedCertifications = initValue.vendorCertificates.map(x => x.id) || [];
    // this.disableConfidentiality = Number(initValue.confidentiality.id) === 2;

    this.form.setValue({
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

    const country = this.countries.find(country => country.id === initValue.country.id);
    if (country) {
      this.zipPattern = this.zipRegs[country.name];
    }
    console.log(`initForm`, initValue, country);
  }

  onChangeVendorType(e) {
    if (Number(e.target.value) === 2 || Number(e.target.value) === 6 || +e.target.value === 1) {
      this.form.setValue({
        ...this.form.value,
        vendorIndustry: 13
      });
    } else {
      this.form.setValue({
        ...this.form.value,
        vendorIndustry: ''
      });
    }
  }

  checkDisable(vendorIndustry): boolean {
    const { vendorType } = this.form.value;

    if (Number(vendorType) === 4) {
      return false;
    }
    return (Number(vendorType) === 2 || Number(vendorType) === 6) && Number(vendorIndustry) !== 13;
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.form.value[field] === '' || this.form.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.form.value[field]) === 0;
    }
  }

  async saveVenorInformation(event) {
    this.submitted = true;
    if (this.form.valid) {
      this.userService.setVendorRegistrationFormValidity('vendor', true);
      this.saveInformation();
      this.router.navigateByUrl('/user-manage/add-vendor/machine');
    } else {
      this.userService.setVendorRegistrationFormValidity('vendor', false);
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }
}
