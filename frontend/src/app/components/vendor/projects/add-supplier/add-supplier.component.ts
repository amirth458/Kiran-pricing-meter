import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild('checkBoxCell') checkBoxCell: TemplateRef<any>;

  bidProjectId: number;
  @Input()
  set value(value: number) {
    this.bidProjectId = value;
  }
  get value(): number {
    return this.bidProjectId;
  }
  @Input()
  exclude: VendorConfirmationResponse[];
  @Input()
  partIds: Array<number>;

  @Output()
  refresh: EventEmitter<any> = new EventEmitter<any>();

  colDefs: ColDef[] = [];
  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  availableSuppliers = [];
  selectableCount: number;

  get isReleaseQueueAvailable(): boolean {
    return (this.availableSuppliers || []).some(item => item.selected);
  }

  constructor(
    public modelService: NgbModal,
    public projectService: ProjectService,
    public spinner: NgxSpinnerService,
    public toaster: ToastrService
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
        headerName: '',
        field: 'selected',
        hide: false,
        sortable: false,
        filter: false,
        width: 60,
        maxWidth: 60,
        cellClass: 'p-0 check-box-column',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.checkBoxCell
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.checkBoxCell
        }
      },
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
          selected: false,
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
      this.modelService.open(this.templateRef, {
        centered: true,
        size: 'lg',
        windowClass: 'add-suppliers-modal'
      });
      this.spinner.hide();
    });
  }

  release() {
    if (this.isReleaseQueueAvailable) {
      this.spinner.show();
      const selectedProfiles = this.availableSuppliers
        .filter(item => item.selected)
        .map(item => ({
          vendorId: item.vendorId,
          releasePriority: item.releasePriority
        }))
        .sort((a, b) => a.releasePriority - b.releasePriority);
      this.projectService
        .saveReleasePMBidToVendor({
          bidPmProjectId: this.value,
          releaseBidPmProjectToVendors: selectedProfiles
        })
        .subscribe(
          response => {
            this.spinner.hide();
            const obj: any = (response || []).length > 0 ? response[0] : null;
            if ((response || []).length > 0) {
              this.refresh.emit();
              this.toaster.success('Successfully released!');
            } else {
              this.toaster.error('unable to release to vendor');
            }
            this.modelService.dismissAll();
          },
          error => {
            this.modelService.dismissAll();
            this.spinner.hide();
            this.toaster.error('Error while releasing to Vendor.');
          }
        );
    } else {
      this.toaster.error('Please add vendors in release queue!');
    }
  }

  onSuppliersGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
