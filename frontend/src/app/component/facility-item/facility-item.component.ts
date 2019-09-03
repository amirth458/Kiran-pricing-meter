import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as facilities from '../../../assets/static/facilities';

import { Router } from '@angular/router';
import { Facility } from 'src/app/model/facility.model';


@Component({
  selector: 'app-facility-item',
  templateUrl: './facility-item.component.html',
  styleUrls: ['./facility-item.component.css']
})
export class FacilityItemComponent implements OnInit, AfterViewChecked {

  form: Facility = {
    id: '',
    venderInfoId: '',
    facilityName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    certifications: '',
    createdBy: '',
    createdDate: '',
    updatedDate: '',
  };

  certificationsOption = [];
  facilities = facilities;
  facilityId = null;

  constructor(private route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.facilityId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const facility = this.facilities.filter(x => x.id == this.facilityId);
      if (facility.length > 0) {
        this.form = { ...this.form, ...facility[0] };
      }
      // Make API request
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
