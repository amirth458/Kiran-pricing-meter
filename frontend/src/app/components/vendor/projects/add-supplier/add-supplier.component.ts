import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { VendorConfirmationResponse } from '../../../../model/bidding.order';
import { TemplateRendererComponent } from '../../../../common/template-renderer/template-renderer.component';
import { ProjectService } from '../../../../service/project.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  @ViewChild('templateRef') templateRef: TemplateRef<any>;
  @ViewChild('vendorCell') vendorCell: TemplateRef<any>;

  @Input()
  exclude: VendorConfirmationResponse[];
  @Input()
  partIds: Array<number>;

  colDefs: ColDef[] = [];
  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  availableSuppliers = [];
  selectableCount: number;

  constructor(
    public modelService: NgbModal,
    public projectService: ProjectService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.setupGrid();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.colDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      domLayout: 'autoHeight'
    };
  }

  setupGrid() {
    this.colDefs = [
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 50,
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Quantity of Process Profiles',
        field: 'quantityOfProcessProfile',
        hide: false,
        sortable: false,
        filter: false
      }
    ];
  }

  getAllSuppliersInfo() {
    this.spinner.show();
    this.projectService.getAllSuppliersAndPartId(this.partIds || []).subscribe(suppliers => {
      const availableSuppliers = (suppliers || []).map((item, index) => {
        const facilityCertificates = (item.facilityCertificates || []).map(facility => facility.name);
        const partCertificates = (item.partCertificates || []).map(partCert => partCert.name);
        return {
          ...item,
          vendorName: item.vendorName,
          vendorType: item.vendorType.name,
          country: item.country.name,
          quantityOfProcessProfile: item.quantityOfProcessProfile,
          facility: item.facility.toString(),
          facilityCertificates: facilityCertificates || '',
          partCertificates: partCertificates || '',
          releasePriority: index + 1
        };
      });
      this.availableSuppliers = availableSuppliers.filter(
        v => this.exclude.find(s => s.vendorId === v.vendorId) === undefined
      );
      console.log(this.availableSuppliers);
      this.modelService.open(this.templateRef, {
        centered: true,
        size: 'lg'
      });
      this.spinner.hide();
    });
  }

  onSuppliersGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
