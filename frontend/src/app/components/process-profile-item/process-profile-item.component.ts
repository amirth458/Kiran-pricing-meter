import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as processProfiles from '../../../assets/static/processProfile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [];
  form = {
    id: '',
    processProfileName: '',
    equipment: '',
    processType: '',
    layerHeight: '',
    infill: '',
    toleranceBase: '',
    tensileStrength: '',
    tensileModulus: '',
    surfaceFinish: '',
  };
  processProfileId = null;
  processProfiles = processProfiles;
  constructor(private route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.processProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const processProfile = this.processProfiles.filter(x => x.id == this.processProfileId);
      if (processProfile.length > 0) {
        this.form = { ...this.form, ...processProfile[0] };
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
    console.log(this.form);
  }
}
