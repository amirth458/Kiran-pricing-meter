import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insight-bidorderitem',
  templateUrl: './insight-bidorderitem.component.html',
  styleUrls: ['./insight-bidorderitem.component.css']
})
export class InsightBidorderitemComponent implements OnInit {
  columnDefs = [];

  constructor(public toastr: ToastrService) {}

  ngOnInit() {
    this.toastr.info('This is under development.');
  }
}
