import { Component, Input, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';

import { ReferenceMedia } from '../../model/part.model';
import { OrdersService } from 'src/app/service/orders.service';

@Component({
  selector: 'app-ref-file',
  templateUrl: './ref-file.component.html',
  styleUrls: ['./ref-file.component.css']
})
export class RefFileComponent implements OnInit {
  @Input() value: number;
  refMediaFiles: ReferenceMedia[];
  count = 0;

  constructor(
    public spinner: NgxSpinnerService,
    public orderService: OrdersService,
    public modalService: NgbModal,
    public toaster: ToastrService
  ) {}

  ngOnInit() {
    this.orderService.getReferenceFileCountByPartId(this.value).subscribe(
      res => {
        this.count = res;
      },
      err => {}
    );
  }

  show(content, size: any = 'lg') {
    this.spinner.show();
    this.orderService
      .getReferenceFiles(this.value)
      .pipe(
        catchError((err: any) => {
          const obj = JSON.parse(err.error && err.error.message ? err.error.message || '{}' : '{}');
          this.toaster.error(`Unable to fulfil your request: ${obj.message || ''}`);
          this.spinner.hide();
          return empty();
        })
      )
      .subscribe(files => {
        this.refMediaFiles = files || [];
        this.spinner.hide();
        const options: any = {
          size,
          centered: true,
          windowClass: 'ref-file-modal',
          scrollable: true
        };
        this.modalService.open(content, options).result.then(
          result => {},
          reason => {}
        );
      });
  }
}
