import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.css']
})
export class ProjectFilterComponent implements OnInit {
  value: FormGroup = this.fb.group({
    projectTypeId: [null],
    selectedMoments: [null],
    searchQuery: null
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit() {}
}
