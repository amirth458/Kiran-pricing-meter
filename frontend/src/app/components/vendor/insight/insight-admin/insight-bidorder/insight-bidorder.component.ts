import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insight-bidorder',
  templateUrl: './insight-bidorder.component.html',
  styleUrls: ['./insight-bidorder.component.css']
})
export class InsightBidorderComponent implements OnInit {
  columnDefs = [];

  constructor(public toastr: ToastrService) {}

  ngOnInit() {
    this.toastr.info('This is under development.');
  }
}
