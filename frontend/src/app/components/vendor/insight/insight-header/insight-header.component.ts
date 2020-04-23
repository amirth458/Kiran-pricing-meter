import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-header',
  templateUrl: './insight-header.component.html',
  styleUrls: ['./insight-header.component.css']
})
export class InsightHeaderComponent implements OnInit {
  search = '';

  constructor() {}

  ngOnInit() {}

  onSearchChange(ev) {
    console.log(ev);
  }
}
