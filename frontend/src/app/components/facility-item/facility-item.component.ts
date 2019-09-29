import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { VendorService } from '../../service/vendor.service';
import { FacilityService } from '../../service/facility.service';
import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorMetaDataTypes } from '../../mockData/vendor';
import { AuthService } from 'src/app/service/auth.service';

import { FileService } from 'src/app/service/file.service';

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

  certifications = [];
  countries = [];
  facilityId = null;
  selectedCertifications = [];
  certDocuments = [];

  isNew = true;
  isSubmited = false;

  userId = 0;
  constructor(
    public fb: FormBuilder,
    public route: Router,
    public vendorService: VendorService,
    public facilityService: FacilityService,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public fileService: FileService,
    public authService: AuthService) { }

  async ngOnInit() {
    this.userId = await this.authService.getVendor().toPromise();
    this.getVendorMetaDatas();
    if (this.route.url.includes('edit')) {
      this.facilityId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      this.isNew = false;
      this.getFacility(this.facilityId);
    }
  }

  async getFacility(facilityId: number) {
    this.spineer.show();
    try {
      const data = await this.facilityService.getFacility(this.userService.getVendorInfo().id, facilityId).toPromise();
      this.initForm(data);
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  async getVendorMetaDatas() {
    this.spineer.show();
    try {
      this.countries = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Country).toPromise();
      this.certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
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
        const vendorId = this.userService.getVendorInfo().id;
        const s3KeyFile = `u/${userId}/v/${vendorId}/certifications/${file.name}`;
        const certFile = {
          s3Key: s3KeyFile,
          fileType: 'PDF',
          base64: reader.result,
        };

        this.fileService.fileUpload(userId, vendorId, certFile).subscribe(res => {
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

  async save(event) {
    this.isSubmited = true;
    if (!(this.facilityItem.valid)) {
      return;
    }
    this.spineer.show();

    const userId = this.userService.getUserInfo().id;
    const vendorId = this.userService.getVendorInfo().id;
    const certFiles = this.certDocuments.filter((item) => item.saved === 0 || item.saved === 1);
    const facility = {
      ...this.facilityItem.value,
      facilityCertificationList: this.selectedCertifications.map((item) => ({
        id: item
      })),
      certificateURLs: certFiles.map((item) => item.name)
    };
    facility.vendorId = vendorId;
    facility.updatedDate = new Date().toString();

    if (this.isNew) {
      facility.createdBy = String(this.userService.getVendorInfo().id);
      facility.createdDate = new Date().toString();
      this.facilityService.createFacility(vendorId, facility).toPromise();
    } else {
      await this.facilityService.updateFacility(vendorId, this.facilityId, facility).toPromise();
    }
    const deletedFiles = this.certDocuments.filter((item) => item.saved === 2 || item.saved === 3);

    for ( const file of deletedFiles) {
      const s3URL = this.fileService.getS3URL(file.name);
      await this.fileService.fileDelete(userId, vendorId, s3URL).toPromise();
    }
    const gotoURL = `/profile/vendor/facilities`;
    this.route.navigateByUrl(gotoURL);
    this.spineer.hide();
  }
}
