import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { Facility } from 'src/app/model/facility.model';

import { VendorService } from '../../service/vendor.service';
import { NgxSpinnerService } from 'ngx-spinner'
import { VendorMetaDataTypes } from '../../mockData/vendor';

@Component({
  selector: 'app-facility-item',
  templateUrl: './facility-item.component.html',
  styleUrls: ['./facility-item.component.css']
})
export class FacilityItemComponent implements OnInit, AfterViewChecked {

  form: Facility = {
    id: '',
    vendorId: '',
    name: '',
    email: '',
    phone: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    country: '',
    facilityCertificationList: [],
    createdBy: '',
    createdDate: '',
    updatedDate: '',
    zipCode: ''
  };

  certifications = [];
  countries = [];
  facilityId = null;
  selectedCertifications = [];

  constructor(
    private route: Router, 
    private vendorService: VendorService,
    private spineer: NgxSpinnerService) { }

  ngOnInit() {
    this.getVendorMetaDatas();
    if (this.route.url.includes('edit')) {
      this.facilityId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      
      // if (facility.length > 0) {
      //   this.form = { ...this.form, ...facility[0] };
      // }
      // Make API request

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
          this.save();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }
  save() {
    let gotoURL = '/profile/basics';
    const urlArray = this.route.url.split('/');
    gotoURL = `/${urlArray[1]}/${urlArray[2]}`;
    this.route.navigateByUrl(gotoURL);
  }

}
