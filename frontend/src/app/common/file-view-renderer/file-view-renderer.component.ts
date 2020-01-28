import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

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
    public spinner: NgxSpinnerService
  ) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onFileClicked(ev: Event, content) {
    ev.stopPropagation();
    this.spinner.show();
    combineLatest(
      this.orderService.getAllMeasurementUnitType(),
      this.orderService.getPartById(
        this.params.data.subOrder || this.params.data.id
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
  }
}
