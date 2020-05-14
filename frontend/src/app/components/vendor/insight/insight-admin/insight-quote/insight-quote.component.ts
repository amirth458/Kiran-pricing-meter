import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insight-quote',
  templateUrl: './insight-quote.component.html',
  styleUrls: ['./insight-quote.component.css']
})
export class InsightQuoteComponent implements OnInit {
  columnDefs = [];

  constructor(public toastr: ToastrService) {}

  ngOnInit() {
    this.toastr.info('This is under development.');
  }
}
