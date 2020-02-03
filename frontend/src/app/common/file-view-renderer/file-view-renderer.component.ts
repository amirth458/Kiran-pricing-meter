import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { OrdersService } from '../../service/orders.service';

import { combineLatest } from 'rxjs';

import { Part } from '../../model/part.model';

@Component({
  selector: 'app-file-view-renderer',
  templateUrl: './file-view-renderer.component.html',
  styleUrls: ['./file-view-renderer.component.css']
})
export class FileViewRendererComponent implements ICellRendererAngularComp {
  params: any;
  measurementUnits;
  partInfo: Part;

  constructor(
    private modalService: NgbModal,
    public orderService: OrdersService,
    public spinner: NgxSpinnerService,
    public toaster: ToastrService
  ) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onFileClicked(ev: Event, content) {
    ev.stopPropagation();
    const partId = this.params.data.partId || (this.params.prop ? this.params.data[this.params.prop] : this.params.data.id);
    if (partId) {
      this.spinner.show();
      combineLatest(
        this.orderService.getAllMeasurementUnitType(),
        this.orderService.getPartById(
          partId
        )
      ).subscribe(([measurementUnits, order]) => {
        this.measurementUnits = measurementUnits;
        this.partInfo = order;
        this.modalService.open(content, {
          centered: true,
          windowClass: 'file-viewer-modal'
        });
        this.spinner.hide();
      });
    } else {
     this.toaster.error('Invalid part id!');
    }
  }
}
