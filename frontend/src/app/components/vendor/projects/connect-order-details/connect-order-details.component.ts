import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { ProjectService } from 'src/app/service/project.service';
import { BidProcessStatusEnum, ConnectProject } from '../../../../model/connect.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchedProcessProfile, Part } from 'src/app/model/part.model';
import { OrdersService } from 'src/app/service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { PartService } from 'src/app/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-connect-order-details',
  templateUrl: './connect-order-details.component.html',
  styleUrls: ['./connect-order-details.component.css']
})
export class ConnectOrderDetailsComponent implements OnInit {
  @ViewChild('vendorCell') vendorCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('replaceSupplierCell') replaceSupplierCell: TemplateRef<any>;
  @ViewChild('createProfileCell') createProfileCell: TemplateRef<any>;
  @ViewChild('emailCell') emailCell: TemplateRef<any>;
  @ViewChild('sendMailModal') sendMailModal: TemplateRef<any>;
  @ViewChild('vendorProfileModal') vendorProfileModal: TemplateRef<any>;
  @ViewChild('replacementProfileModal') replacementProfileModal: TemplateRef<any>;

  supplierGridOptions: GridOptions[] = [];
  vendorProfileGridOptions: GridOptions[] = [];
  supplierColumnDefs: Array<ColDef[]> = [];
  vendorProfileColumnDefs: ColDef[] = [];
  replacementProfileColumnDefs: ColDef[] = [];

  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  prodEXSupplier = [];
  customerSelectedSupplier = [];
  customerSupplierToInvite = [];
  replacementProfiles = [];
  selectedVendor = null;

  selectedProdEXVendorIds = [];

  matchingProfiles: MatchedProcessProfile[] = [];
  parts: Part[] = [];

  projectDetails: ConnectProject;
  statusTypes = BidProcessStatusEnum;
  customerOrderId = null;
  prodEXRequestedCount = 2;
  constructor(
    public projectService: ProjectService,
    public partService: PartService,
    public orderService: OrdersService,
    public modal: NgbModal,
    public route: ActivatedRoute,
    public spineer: NgxSpinnerService,
    public toaster: ToastrService,
    public location: Location
  ) {
    this.customerOrderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.initColumnDefs();
    this.initGridOptions();
    this.getData();
  }

  get vendorProfiles() {
    return this.matchingProfiles.filter(item => item.vendorId === this.selectedVendor.vendorId);
  }

  get canReleaseToSelectedProdEXSuppliers() {
    return this.selectedProdEXVendorIds.length === this.prodEXRequestedCount;
  }

  get canReleaseToInvitedEXSuppliers() {
    return (
      this.supplierGridOptions.length &&
      this.supplierGridOptions[2].api &&
      this.projectDetails &&
      (this.supplierGridOptions[2].api.getSelectedNodes() || []).length
    );
  }

  getData() {
    this.spineer.show();
    this.projectService
      .getConnectProject(this.customerOrderId)
      .pipe(
        mergeMap(project =>
          this.partService.getPartsById(project.partIds).pipe(
            map(parts => {
              return { ...project, parts };
            })
          )
        )
      )
      .subscribe(
        r => {
          this.projectDetails = {
            ...r,
            prodexSuppliers: r.prodexSuppliers || [],
            customerSelectedSuppliers: r.customerSelectedSuppliers || []
          };
          this.customerSupplierToInvite = [];
          this.spineer.hide();
        },
        e => {
          this.spineer.hide();
          this.toaster.error('Error while fetching data');
          this.location.back();
        }
      );
  }

  showVendorProfiles(ev, data) {
    ev.stopPropagation();

    this.selectedVendor = data;
    this.modal.open(this.vendorProfileModal, {
      centered: true,
      size: 'lg'
    });
  }

  showReplacementProfiles(ev, data) {
    ev.stopPropagation();

    this.selectedVendor = data;
    this.modal.open(this.replacementProfileModal, {
      centered: true,
      size: 'lg'
    });
  }

  onSuppliersGridReady(index, ev) {
    this.supplierGridOptions[index].api = ev.api;
    this.supplierGridOptions[index].api.sizeColumnsToFit();
  }

  onVendorProfileReady(index, ev) {
    this.vendorProfileGridOptions[index].api = ev.api;
    this.vendorProfileGridOptions[index].api.sizeColumnsToFit();
  }

  releaseProjectToSupplier() {
    this.spineer.show();
    this.projectService
      .releaseConnectProject(this.projectDetails.customerOrderId, this.selectedProdEXVendorIds)
      .subscribe(
        r => {
          this.selectedProdEXVendorIds = [];
          this.supplierGridOptions[0].api.deselectAll();
          this.spineer.hide();
          this.toaster.success('Project Released To ProdEX Suppliers');
          this.getData();
        },
        r => {
          this.spineer.hide();
          this.selectedProdEXVendorIds = [];
          this.supplierGridOptions[0].api.deselectAll();
          if (
            (r.error.message || '').includes('SHOPSIGHT_360_PLUS') ||
            (r.error.message || '').includes('Contract not found')
          ) {
            this.toaster.error("Vendor doesn't have SHOPSIGHT 360 PLUS");
          } else {
            this.toaster.error('Error While Releasing Project To ProdEX Suppliers.');
          }
          this.getData();
          console.log(r);
        }
      );
  }

  initGridOptions() {
    this.vendorProfileGridOptions = [
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.vendorProfileColumnDefs,
        enableColResize: true,
        rowHeight: 45,
        headerHeight: 35
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.replacementProfileColumnDefs,
        enableColResize: true,
        rowHeight: 45,
        headerHeight: 35
      }
    ];

    this.supplierGridOptions = [
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.supplierColumnDefs[0],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        domLayout: 'autoHeight',
        isRowSelectable: rowNode => {
          // (rowNode.data.status || '').replace(/_/g, ' ') !== BidProcessStatusEnum.VENDOR_RECEIVED;
          return (rowNode.data.status || '').length === 0;
        },
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
            this.selectedProdEXVendorIds.push(ev.data.vendorId);
          } else {
            const foundIndex = this.selectedProdEXVendorIds.findIndex(_ => _ === ev.data.vendorId);
            if (foundIndex !== -1) {
              this.selectedProdEXVendorIds.splice(foundIndex, 1);
            }
          }
        }
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.supplierColumnDefs[1],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        domLayout: 'autoHeight'
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.supplierColumnDefs[2],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        rowSelection: 'multiple',
        domLayout: 'autoHeight',
        rowMultiSelectWithClick: true,
        isRowSelectable: rowNode => {
          return true;
        },
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
          }
        }
      }
    ];
  }

  initColumnDefs() {
    this.vendorProfileColumnDefs = [
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 30
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: false,
        filter: false
      }
    ];
    this.replacementProfileColumnDefs = [
      {
        headerName: '',
        field: 'chooseall',
        checkboxSelection: true,
        hide: false,
        sortable: false,
        filter: false,
        width: 80
      },
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 30
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Quantity of Process Profiles Name',
        field: 'quantity',
        hide: false,
        sortable: false,
        filter: false
      }
    ];

    this.supplierColumnDefs = [
      // 0 - ProdEX Supplier
      [
        {
          headerName: '',
          field: 'chooseall',
          checkboxSelection: true,
          hide: false,
          sortable: false,
          filter: false,
          width: 80
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
          headerName: 'Vendor',
          field: 'vendor',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'City',
          field: 'city',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'State',
          field: 'state',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Status',
          cellRenderer: 'templateRenderer',
          hide: false,
          sortable: false,
          filter: false,
          cellRendererParams: {
            ngTemplate: this.statusCell
          }
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          hide: false,
          sortable: false,
          filter: false,
          cellRendererParams: {
            ngTemplate: this.replaceSupplierCell
          }
        }
      ],
      // 1 - Customer Selected Supplier
      [
        {
          headerName: 'No',
          valueGetter: 'node.rowIndex + 1',
          width: 50,
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Vendor',
          field: 'vendor',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'City',
          field: 'city',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'State',
          field: 'state',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Status',
          cellRenderer: 'templateRenderer',
          hide: false,
          sortable: false,
          filter: false,
          cellRendererParams: {
            ngTemplate: this.statusCell
          }
        }
      ],
      // 2 - Supplier to invite without check
      [
        {
          headerName: '',
          field: 'chooseall',
          checkboxSelection: true,
          hide: false,
          sortable: false,
          filter: false,
          width: 80
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
          headerName: 'Contact Name',
          field: 'contactName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Email',
          field: 'email',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Phone',
          field: 'phone',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          width: 80,
          hide: false,
          sortable: false,
          filter: false,
          cellRendererParams: {
            ngTemplate: this.emailCell
          }
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          hide: false,
          sortable: false,
          filter: false,
          cellRendererParams: {
            ngTemplate: this.createProfileCell
          }
        }
      ]
    ];
  }
}
