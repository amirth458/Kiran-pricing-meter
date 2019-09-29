import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as internationalCode from '../../../assets/static/internationalCode';
import { VendorService } from '../../service/vendor.service';
import { Vendor, VendorMetaData } from '../../model/vendor.model';

import { VendorMetaDataTypes } from '../../mockData/vendor';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { FileService } from 'src/app/service/file.service';

declare var $: any;
@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})

export class BasicDetailsComponent implements OnInit, AfterViewChecked {

  constructor(
    public fb: FormBuilder,
    public vendorService: VendorService,
    public userService: UserService,
    public authService: AuthService,
    public fileService: FileService,
    public spineer: NgxSpinnerService,
    public route: Router
  ) {}

  internationalCode = internationalCode;
  vendorTypes: VendorMetaData[] = [];
  vendorIndustries: VendorMetaData[] = [];
  countries: VendorMetaData[] = [];
  certifications: VendorMetaData[] = [];
  confidentialities: VendorMetaData[] = [];
  selectedCertifications = [];
  certDocuments = [];
  isSubmited = false;

  detailForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
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

  ngOnInit() {
    this.getVendorMetaDatas();

    this.authService.getVendor().subscribe(res => {
      this.userService.setVendorInfo(res);

      if (res) {
        this.vendorService.getVendorDetail(res.id).subscribe(res1 => {
          if (res1) {
            this.initForm(res1);
          }
        });
      } else {
        this.detailForm.setValue({
          ...this.detailForm.value,
          confidentiality: 1,
        });
      }
    }, error => {
      console.log('get profile error', error);
    });
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
    this.disableConfidentiality = Number(initValue.confidentiality) === 2;
    this.detailForm.setValue({
      id: initValue.id,
      name: initValue.name,
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
  onChangeVendorType(e) {
    console.log(e.target.value);
    if (Number(e.target.value) === 2 || Number(e.target.value) === 6) {
      this.detailForm.setValue({
        ...this.detailForm.value,
        vendorIndustry: 13,
      });

    } else {
      this.detailForm.setValue({
        ...this.detailForm.value,
        vendorIndustry: 1,
      });
    }
  }

  checkDisable(vendorIndustry): boolean {
    const { vendorType } = this.detailForm.value;

    return ((Number(vendorType) === 2 || Number(vendorType) === 6) && Number(vendorIndustry) !== 13) ||
      ((Number(vendorType) !== 2 && Number(vendorType) !== 6) && Number(vendorIndustry) === 13);
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
      const vendorId = this.userService.getVendorInfo().id;
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

      if (this.userService.getVendorInfo()) {
        const res = await this.vendorService.updateVendorProfile(vendorProfile).toPromise();
        console.log(res);
        this.initForm(res);
        this.userService.setVendorInfo(res);
      } else {
        const res = await this.vendorService.createVendorProfile(vendorProfile).toPromise();
        this.initForm(res);
        this.userService.setVendorInfo(res);
      }

      const deletedFiles = this.certDocuments.filter((item) => item.saved === 2 || item.saved === 3);

      for ( const file of deletedFiles) {
        const s3URL = this.fileService.getS3URL(file.name);
        await this.fileService.fileDelete(userId, vendorId, s3URL).toPromise();
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
