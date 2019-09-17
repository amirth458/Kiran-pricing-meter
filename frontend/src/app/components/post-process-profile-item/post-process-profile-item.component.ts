import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as postProcessProfile from '../../../assets/static/postProcessProfile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-process-profile-item',
  templateUrl: './post-process-profile-item.component.html',
  styleUrls: ['./post-process-profile-item.component.css']
})
export class PostProcessProfileItemComponent implements OnInit, AfterViewChecked {

  searchColumns = [];
  filterColumns = [
    {
      name: 'Tolerance Increment', checked: true, field: 'toleranceIncrement'
    },
    {
      name: 'Surface Finish Increment', checked: true, field: 'surfaceFinishIncrement'
    }
  ];
  type = ['filter'];

  form = {
    id: '',
    postProcessProfileName: '',
    asset: '',
    postProcessProfileFamily: '',
    postProcessType: '',
    material: '',
    toleranceIncrement: '',
    surfaceFinishIncrement: '',
    // More inputs need to be included
    createdBy: '',
    createdDate: '',
    updatedDate: '',
  };
  postProcessProfileId = null;
  postProcessProfile = postProcessProfile;

  assetOption = [
    'Hi Power Polisher',
    'Manual Labor',
  ];
  materialOption = [
    'Titanium 64',
    'Stainless Steel 316L',
  ];
  processTypeOption = ['Surface Improvement'];
  processFamilyOption = ['Sanding', 'Polishing'];

  inputOptions = [
    { name: 'Tolerance Increment', field: 'toleranceIncrement', checked: true },
    { name: 'Surface Finish Increment', field: 'surfaceFinishIncrement', checked: true }
  ];
  displayedOptions = [];
  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.postProcessProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const machine = this.postProcessProfile.filter(x => x.id == this.postProcessProfileId);
      if (machine.length > 0) {
        this.form = { ...this.form, ...machine[0] };
      }
      // Make API request
    }
    this.filterColumnsChange({});
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

  searchColumnsChange(event) {

  }

  filterColumnsChange(event) {
    this.filterColumns.map(column => {
      this.inputOptions.map(input => {
        if (column.field === input.field) {
          input.checked = column.checked;
          if (input.checked && !this.displayedOptions.includes(input)) {
            this.displayedOptions.push(input);
          }
          if (!input.checked && this.displayedOptions.includes(input)) {
            const index = this.displayedOptions.indexOf(input);
            this.displayedOptions.splice(index, 1);
          }
        }
      });
    });
  }

  save() {
    console.log(this.form);
  }
}

