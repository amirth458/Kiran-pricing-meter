import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { Facility } from 'src/app/model/facility.model';

import { VendorService } from '../../service/vendor.service';
import { FacilityService } from '../../service/facility.service';
import { UserService } from '../../service/user.service';
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
    zipCode: '',
    city: '',
    state: '',
    country: '',
    facilityCertificationList: [],
    createdBy: '',
    createdDate: '',
    updatedDate: ''
  };

  certifications = [];
  countries = [];
  facilityId = null;
  selectedCertifications = [];
  isNew = true;
  constructor(
    private route: Router, 
    private vendorService: VendorService,
    private facilityService: FacilityService,
    private spineer: NgxSpinnerService,
    private userService: UserService) { }

  ngOnInit() {
    this.getVendorMetaDatas();
    if (this.route.url.includes('edit')) {
      this.facilityId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      this.isNew = false;
      this.getFacility(this.facilityId);
    }
  }

  async getFacility( facilityId: number) {
    this.spineer.show();
    try {
      this.form = await this.facilityService.getFacility(this.userService.getUserInfo().id, facilityId).toPromise();
      const certs = this.form['vendorFacilityCertificationList'];
      const arrCerts = [];
      certs.forEach(cert => {
        arrCerts.push(cert.facilityCertification.id);
      });
      this.selectedCertifications = arrCerts;
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

  prepareData() {
    const arrCerts = []
    this.selectedCertifications.forEach((cert_id)=>{
      arrCerts.push({id: cert_id});
    })
    this.form.updatedDate = new Date().toString();
    this.form.facilityCertificationList = arrCerts;
    delete this.form['vendorFacilityCertificationList'];

    if(this.isNew) {
      this.form.createdBy = this.userService.getUserInfo().name;
      this.form.createdDate = new Date().toString();
    } else {
      this.form.updatedDate = new Date().toString();
    }
  }

  isEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return true;
    }
    return false;
  }

  validateData(): boolean {
   
    if(
      this.form.name === '' ||
      this.form.email === '' ||
      this.form.phone === '' ||
      this.form.street1 === '' ||
      this.form.street2 === '' ||
      this.form.zipCode === '' ||
      this.form.city === '' ||
      this.form.state === '' ||
      this.form.country === '' ||
      !this.isEmail(this.form.email)
    ) {
      return false;
    }
    return true;
  }

  async save() {    
    this.prepareData();
    if (!this.validateData()) return;

    const vendorId = this.userService.getUserInfo().id;

    if(this.isNew) {      
      this.spineer.show();
      try {
        await this.facilityService.createFacility(vendorId, this.form).toPromise();
      } catch (e) {
        this.spineer.hide();
        console.log(e);
      } finally {
        this.spineer.hide();
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL);
      }
      
    } else {
      this.spineer.show();
      try {
        await this.facilityService.updateFacility(vendorId, this.facilityId, this.form).toPromise();
      } catch (e) {
        this.spineer.hide();
        console.log(e);
      } finally {
        this.spineer.hide();
        const gotoURL = `/profile/vendor/facilities`;
        this.route.navigateByUrl(gotoURL);
      }
      
    }
  }
}
