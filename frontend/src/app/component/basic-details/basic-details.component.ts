import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as internationalCode from '../../../assets/static/internationalCode';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit, AfterViewChecked {

  form = {
    vendor_name: '',
    vendor_type: '',
    email: '',
    phone: '',
    primary_address: '',
    city: '',
    state: '',
    country: '',
    certifications: '',
    confidentiality: '',
  };
  internationalCode = internationalCode;
  certificationsOption = [];
  confidentialityOption = [];
  constructor() { }

  ngOnInit() {
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
        }
        form.classList.add('was-validated');
      }, false);
    });
  }
  save() {
    console.log(this.form);
  }
}
