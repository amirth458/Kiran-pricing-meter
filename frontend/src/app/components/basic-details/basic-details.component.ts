import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as internationalCode from '../../../assets/static/internationalCode';
import { VendorService } from '../../service/vendor.service';
import { Vendor, VendorMetaData, Country } from '../../model/vendor.model';
import { VendorMetaDataTypes } from '../../mockData/vendor';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { FileService } from 'src/app/service/file.service';
import { Store, select } from '@ngrx/store';
import { AppTypes, AppFields, Observable } from 'src/app/store';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})

export class BasicDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private userService: UserService,
    private fileService: FileService,
    private spineer: NgxSpinnerService,
    private store: Store<any>,
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
  certDocuments = [];
  isSubmited = false;
  vendor: Observable<Vendor>;
  sub: Subscription;
  phoneUtil = PhoneNumberUtil.getInstance();

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
  disableConfidentiality = false;
  saveSuccessfully = false;
  vendorId = 0;

  ngOnInit() {
    this.getVendorMetaDatas();
    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.initForm(res);
        this.vendorId = Number(res.id);
      } else {
        this.vendorId = 0;
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
    this.spineer.show();
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
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  onChangeConfidentiality(e) {
    this.disableConfidentiality = Number(e.target.value) === 2;
  }

  initForm(initValue: Vendor) {
    this.selectedCertifications = initValue.vendorCertificates.map(x => x.id) || [];
    this.certDocuments = initValue.certificateURLs.map(x => {
      return {
        name: x,
        fileName: this.fileService.getFileNameFromPath(x),
        saved: 1
      };
    });
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

  onOpenFile(event) {
    $('#file').click();
  }

  upload = (file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const userId = this.userService.getUserInfo().id;
        const s3KeyFile = `u/${userId}/v/${this.vendorId}/certifications/${file.name}`;
        const certFile = {
          s3Key: s3KeyFile,
          fileType: 'PDF',
          base64: reader.result,
        };
        this.fileService.fileUpload(userId, this.vendorId, certFile).subscribe(res => {
          this.certDocuments.push({name: res.s3URL, fileName: file.name, saved: 0});
        }, error => {
          console.log(error);
        });
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
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

  onRemoveFile(name) {
    const certFiles = this.certDocuments.filter((item) => item.name === name);
    if (certFiles[0].saved === 3) {
      certFiles[0].saved = 0;
    } else if (certFiles[0].saved === 2) {
      certFiles[0].saved = 1;
    } else if (certFiles[0].saved === 1) {
      certFiles[0].saved = 2;
    } else {
      certFiles[0].saved = 3;
    }
  }
  onFileChange(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      this.upload(file);
    }
  }

  async save(event) {
    this.isSubmited = true;
    if (this.detailForm.valid) {
      const userId = this.userService.getUserInfo().id;

      const certFiles = this.certDocuments.filter((item) => item.saved === 0 || item.saved === 1);
      this.spineer.show();
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
        certificateURLs: certFiles.map((item) => item.name)
      };

      if (this.vendorId > 0) {
        try {
          const res = await this.vendorService.updateVendorProfile(vendorProfile).toPromise();
          this.toastr.success(this.detailForm.value.name + ' is updated Successfully');
          this.store.dispatch({
            type: AppTypes.UpdateVendorInfo,
            payload: res
          });
        } catch (e) {
          this.toastr.error('We are sorry, ' + this.detailForm.value.name + ' update failed. Please try again later.');
        } finally {
          this.spineer.hide();
        }
      } else {
        try {
          const res = await this.vendorService.createVendorProfile(vendorProfile).toPromise();
          this.toastr.success(this.detailForm.value.name + ' is created Successfully');
          this.store.dispatch({
            type: AppTypes.CreateVendorInfo,
            payload: res
          });
        } catch (e) {
          this.toastr.error('We are sorry, ' + this.detailForm.value.name + ' creation failed. Please try again later.');
        } finally {
          this.spineer.hide();
        }
      }
      const deletedFiles = this.certDocuments.filter((item) => item.saved === 2 || item.saved === 3);

      if (this.vendorId > 0) {
        for ( const file of deletedFiles) {
          const s3URL = this.fileService.getS3URL(file.name);
          await this.fileService.fileDelete(userId, this.vendorId, s3URL).toPromise();
        }
      }

      this.spineer.hide();
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }
}
