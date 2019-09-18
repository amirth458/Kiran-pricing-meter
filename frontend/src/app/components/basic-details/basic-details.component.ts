import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as internationalCode from '../../../assets/static/internationalCode';
import { VendorService } from '../../service/vendor.service';
import { Vendor, VendorMetaData } from '../../model/vendor.model';
import { VendorMetaDataTypes } from '../../mockData/vendor';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit, AfterViewChecked {
  internationalCode = internationalCode;
  vendorTypes: VendorMetaData[] = [];
  vendorIndustries: VendorMetaData[] = [];
  countries: VendorMetaData[] = [];
  certifications: VendorMetaData[] = [];
  confidentialities: VendorMetaData[] = [];
  selectedCertifications = [];
  selectedVendorIndustry = [];

  detailForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    vendorType: [null, Validators.required],
    vendorIndustry: [null],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    street1: [null, Validators.required],
    street2: [null, Validators.required],
    zipCode: [null, [Validators.required, Validators.pattern(/^[0-9\s]{5}$/)]],
    confidentiality: null,
    vendorCertificates: null
  });

  constructor(
    public fb: FormBuilder,
    public vendorService: VendorService,
    public userService: UserService,
    public spineer: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.getVendorMetaDatas();
    this.vendorService.getVendorDetail(this.userService.getUserInfo().id).subscribe(res => {
      if (res) {
        this.initForm(res);
      }
    });
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
        return { id: x.id, name };
      });
      this.vendorIndustries = vendorIndustries.map((x) => {
        const name = this.htmlDecode(x.name).replace(/&/g, ' and ');
        return { id: x.id, name };
      });
      this.certifications = certifications.map((x) => {
        const name = this.htmlDecode(x.name);
        return { id: x.id, name };
      });
      this.confidentialities = confidentialities.map((x) => {
        const name = this.htmlDecode(x.name);
        return { id: x.id, name };
      });

    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  initForm(initValue: Vendor) {
    this.selectedCertifications = initValue.vendorCertificates.map(x => x.id) || [];
    this.selectedVendorIndustry = initValue.vendorIndustries.map(x => x.id) || [];

    this.detailForm.setValue({
      id: initValue.id,
      name: initValue.name,
      email: initValue.email,
      phone: initValue.phone,
      vendorType: initValue.vendorType.id,
      vendorIndustry: [],
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

  save(event) {
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
      vendorIndustries: this.vendorIndustries.filter((item) => this.selectedVendorIndustry.includes(item.id))
    };
    this.vendorService.updateVendorProfile(vendorProfile).subscribe(res => {
      this.initForm(res);
      this.spineer.hide();
    }, error => {
      console.log(error);
      this.spineer.hide();
    });
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }
}
