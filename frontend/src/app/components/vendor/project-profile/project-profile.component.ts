import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.css']
})
export class ProjectProfileComponent implements OnInit {

  detailForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    antiMatch: [null, Validators.required],
    nda: [null, Validators.required],
    countries: [null, Validators.required],
    facilityCertifications: [null, Validators.required],
    partCertification: [null, Validators.required],

  });

  error = '';
  submitted = false;

  antiMatchOptions = [];
  ndaOptions = [];
  countryOptions = [];
  facilityCertificationsOptions = [];
  partCertificationOptions = [];

  constructor(
    public fb: FormBuilder,
    public router: Router
  ) { }

  ngOnInit() { }


  get f() { return this.detailForm.controls; }

  showRequired(field: string): boolean {
    return this.submitted && (this.detailForm.value[field] === null || this.detailForm.value[field].length === 0);
  }

  onAntiMatchSearch() { }
  onCountrySearch() { }
  onFacilityCertificationSearch() { }
  onPartCertificationSearch() { }

  save() {
    this.submitted = true;

    if (this.detailForm.invalid) {
      return;
    }

  }

  saveAsProjectProfile() {
    this.router.navigateByUrl(this.router.url + '/basic');
  }

}
