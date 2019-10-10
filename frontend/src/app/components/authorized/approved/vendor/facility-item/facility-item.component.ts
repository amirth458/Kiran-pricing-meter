import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { NgxSpinnerService } from 'ngx-spinner';

import * as internationalCode from '../../../../../../assets/static/internationalCode';

import { VendorService } from '../../../../../service/vendor.service';
import { FacilityService } from '../../../../../service/facility.service';
import { UserService } from '../../../../../service/user.service';
import { VendorMetaDataTypes } from '../../../../../mockData/vendor';
import { AuthService } from 'src/app/service/auth.service';

import { FileService } from 'src/app/service/file.service';
import { Subscription, Observable } from 'rxjs';
import { Vendor, Country } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-facility-item',
  templateUrl: './facility-item.component.html',
  styleUrls: ['./facility-item.component.css']
})
export class FacilityItemComponent implements OnInit, AfterViewChecked {

  facilityItem: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    primaryContactFirstName: [null, Validators.required],
    primaryContactLastName: [null, Validators.required],
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, Validators.required],
    street1: [null, Validators.required],
    street2: [null],
    zipCode: [null, Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    facilityCertificationList: null,
    createdBy: null,
    createdDate: null,
    updatedDate: null
  });
  internationalCode = internationalCode;
  phoneUtil = PhoneNumberUtil.getInstance();
  certifications = [];
  countries = [];
  facilityId = null;
  selectedCertifications = [];
  certDocuments = [];

  isNew = true;
  isSubmited = false;
  vendor: Observable<Vendor>;
  sub: Subscription;
  vendorId = 0;
  error = '';
  userId = 0;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private vendorService: VendorService,
    private facilityService: FacilityService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private fileService: FileService,
    private authService: AuthService,
    private store: Store<any>,
    private toastr: ToastrService,
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  async ngOnInit() {
    this.userId = await this.authService.getVendor().toPromise();
    this.getVendorMetaDatas();
    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.vendorId = Number(res.id);
      } else {
        this.vendorId = 0;
      }
      if (this.route.url.includes('edit')) {
        this.facilityId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        this.isNew = false;
        this.getFacility(this.facilityId);

      } else {
        this.isNew = true;
      }
    });
    this.onValueChanges();
  }
  onValueChanges(): void {
    this.facilityItem.get('phone').valueChanges.subscribe(val => {
      try {
        const phoneNumber = this.phoneUtil.parseAndKeepRawInput(val);
        const region = this.phoneUtil.getRegionCodeForNumber(phoneNumber);
        if (!region) { return; }
        const selectedCountries = this.internationalCode.filter((country: Country) => country.code === region);
        if (selectedCountries.length === 0) {
          return;
        }
        const { name } = selectedCountries[0];
        this.facilityItem.patchValue({
          country: name
        });
      } catch (e) {
        // console.log(e);
      } finally {

      }
    });
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.facilityItem.value[field] === '' || this.facilityItem.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.facilityItem.value[field]) === 0;
    }
  }

  async getFacility(facilityId: number) {
    this.spinner.show();
    try {
      const data = await this.facilityService.getFacility(this.vendorId, facilityId).toPromise();
      this.initForm(data);
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async getVendorMetaDatas() {
    this.spinner.show();
    try {
      this.countries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Country).toPromise();
      this.certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
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

  initForm(data: any) {
    this.selectedCertifications = data.vendorFacilityCertificationList.map(x => x.facilityCertification.id) || [];
    this.certDocuments = data.certificateURLs.map(x => {
      return {
        name: x,
        fileName: this.fileService.getFileNameFromPath(x),
        saved: 1
      };
    });
    this.facilityItem.setValue({
      id: data.id,
      vendorId: data.vendorId,
      primaryContactFirstName: data.primaryContactFirstName,
      primaryContactLastName: data.primaryContactLastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      street1: data.street1 || '',
      street2: data.street2 || '',
      zipCode: data.zipCode || '',
      city: data.city,
      state: data.state,
      country: data.country,
      facilityCertificationList: [],
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      updatedDate: data.updatedDate || '',
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

  async deleteRemovedFiles(userId) {
    const deletedFiles = this.certDocuments.filter((item) => item.saved === 2 || item.saved === 3);

    for ( const file of deletedFiles) {
      const s3URL = this.fileService.getS3URL(file.name);
      await this.fileService.fileDelete(userId, this.vendorId, s3URL).toPromise();
    }
  }
  async save(event) {
    this.isSubmited = true;
    if (!(this.facilityItem.valid)) {
      return;
    }
    this.spinner.show();

    const userId = this.userService.getUserInfo().id;
    const certFiles = this.certDocuments.filter((item) => item.saved === 0 || item.saved === 1);
    const facilityName = this.facilityItem.value.name;
    const facility = {
      ...this.facilityItem.value,
      facilityCertificationList: this.selectedCertifications.map((item) => ({
        id: item
      })),
      certificateURLs: certFiles.map((item) => item.name)
    };
    facility.vendorId = this.vendorId;
    facility.updatedDate = new Date().toString();

    if (this.isNew) {
      facility.createdBy = String(this.vendorId);
      facility.createdDate = new Date().toString();

      try {
        await this.facilityService.createFacility(this.vendorId, facility).toPromise();
        this.deleteRemovedFiles(userId);
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: '"' + facilityName + '" created.' } } });
      } catch (e) {
        this.toastr.error('We are sorry, ' + facilityName + ' creation failed. Please try again later.');
        this.error = e.error.message;
        console.log(e);
      } finally {
        this.spinner.hide();
      }
    } else {

      try {
        await this.facilityService.updateFacility(this.vendorId, this.facilityId, facility).toPromise();
        this.deleteRemovedFiles(userId);
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: '"' + facilityName + '" updated.' } } });
      } catch (e) {
        this.toastr.error('We are sorry, ' + facilityName + ' update failed. Please try again later.');
        this.error = e.error.message;
        console.log(e);
      } finally {
        this.spinner.hide();
      }
    }
  }
}
