import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { VendorService } from '../../service/vendor.service';
import { FacilityService } from '../../service/facility.service';
import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorMetaDataTypes } from '../../mockData/vendor';
import { AuthService } from 'src/app/service/auth.service';

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
    street2: [null, Validators.required],
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
  isNew = true;
  isSubmited = false;

  userId;
  constructor(
    public fb: FormBuilder,
    public route: Router,
    public vendorService: VendorService,
    public facilityService: FacilityService,
    public spineer: NgxSpinnerService,
    public userService: UserService,
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

  save(event) {
    this.isSubmited = true;
    if (!(this.facilityItem.valid && this.facilityItem.dirty)) {
      return;
    }
    this.spineer.show();

    const vendorId = this.userService.getVendorInfo().id;

    const facility = {
      ...this.facilityItem.value,
      facilityCertificationList: this.selectedCertifications.map((item) => ({
        id: item
      }))
    };
    facility.vendorId = vendorId;
    facility.updatedDate = new Date().toString();

    if (this.isNew) {
      facility.createdBy = String(this.userService.getVendorInfo().id);
      facility.createdDate = new Date().toString();

      this.facilityService.createFacility(vendorId, facility).subscribe(res => {
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL);
        this.spineer.hide();
      }, error => {
        console.log(error);
        this.spineer.hide();
      });
    } else {
      this.facilityService.updateFacility(vendorId, this.facilityId, facility).subscribe(res => {
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL);
        this.spineer.hide();
      }, error => {
        console.log(error);
        this.spineer.hide();
      });
    }
  }
}
