import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as internationalCode from '../../../../../assets/static/internationalCode';
import { VendorService } from '../../../../service/vendor.service';
import { Vendor, VendorMetaData, Country } from '../../../../model/vendor.model';
import { VendorMetaDataTypes } from '../../../../mockData/vendor';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppFields, Store, AppTypes } from 'src/app/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unapproved-vendor-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})

export class UnapprovedVendorDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorService: VendorService,
    private userService: UserService,
    private store: Store<any>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
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
  vendorId = 0;
  status = 0;
  primaryContactName = '';
  vendor: Observable<any>;
  sub: Subscription;

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

  async ngOnInit() {
    await this.getVendorMetaDatas();
    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.initForm(res);
        this.vendorId = Number(res.id);
        if (res.approved) {
          this.status = 1; // approved
        } else {
          if (res.approvedAt !== null) {
            this.status = 2; // declined
          } else {
            this.status = 3; // non-approved
          }
        }
      } else {
        this.vendorId = 0;
        this.status = 0; // can't approve, decline
        this.detailForm.setValue({
          ...this.detailForm.value,
          confidentiality: 1,
        });
      }
    });
    this.onValueChanges();
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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

  initForm(initValue) {
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
    if (this.detailForm.valid) {
      const userId = this.userService.getUserInfo().id;

      // const certFiles = this.certDocuments.filter((item) => item.saved === 0 || item.saved === 1);
      this.spinner.show();
      const vendorProfile = {
        ...this.detailForm.value,
        vendorType: {
          id: this.detailForm.value.vendorType
        },
        vendorIndustry: {
          id: this.detailForm.value.vendorIndustry
        },
        country: {
          id: this.detailForm.value.country
        },
        confidentiality: {
          id: this.detailForm.value.confidentiality
        },
        vendorCertificates: this.certifications.filter((item) => this.selectedCertifications.includes(item.id)),
        vendorIndustries: [{
          id: this.detailForm.value.vendorIndustry
        }],
        // certificateURLs: certFiles.map((item) => item.name)
      };

      if (this.vendorId > 0) {
        try {
          const res = await this.vendorService.updateVendorProfile(vendorProfile).toPromise();
          this.toastr.success('Vendor details updated Successfully');
          this.store.dispatch({
            type: AppTypes.UpdateVendorInfo,
            payload: res
          });
          setTimeout(() => {
            this.router.navigateByUrl('/profile/unapproved/machine');
          }, 1000);
        } catch (e) {
          this.toastr.error('We are sorry, Vendor details update failed. Please try again later.');
        } finally {
          this.spinner.hide();
        }
      } else {
        try {
          const res = await this.vendorService.createVendorProfile(vendorProfile).toPromise();
          this.toastr.success('Vendor details created Successfully');
          this.store.dispatch({
            type: AppTypes.CreateVendorInfo,
            payload: res
          });
          setTimeout(() => {
            this.router.navigateByUrl('/profile/unapproved/machine');
          }, 1000);
        } catch (e) {
          this.toastr.error('We are sorry, Vendor details creation failed. Please try again later.');
        } finally {
          this.spinner.hide();
        }
      }
      // const deletedFiles = this.certDocuments.filter((item) => item.saved === 2 || item.saved === 3);

      // if (this.vendorId > 0) {
      //   for ( const file of deletedFiles) {
      //     const s3URL = this.fileService.getS3URL(file.name);
      //     await this.fileService.fileDelete(userId, this.vendorId, s3URL).toPromise();
      //   }
      // }

      this.spinner.hide();
    }
  }
}
