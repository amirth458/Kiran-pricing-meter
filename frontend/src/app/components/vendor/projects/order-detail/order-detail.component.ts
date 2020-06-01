import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions, ColDef } from 'ag-grid-community';
import { combineLatest } from 'rxjs';

import { OrdersService } from 'src/app/service/orders.service';
import { MetadataService } from 'src/app/service/metadata.service';
import { PartService } from 'src/app/service/part.service';
import { UserService } from 'src/app/service/user.service';
import { Part, MatchedProcessProfile, ReferenceFile } from 'src/app/model/part.model';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { Util } from 'src/app/util/Util';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('removeCell') removeCell: TemplateRef<any>;
  @ViewChild('moveCell') moveCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('vendorCell') vendorCell: TemplateRef<any>;
  @ViewChild('vendorProfile') vendorProfileModal: TemplateRef<any>;
  @ViewChild('addSupplier') addSupplier: TemplateRef<any>;
  @ViewChild('reference') reference: TemplateRef<any>;

  measurementUnits: any;
  postProcessAction = [];
  selectedVendor;

  supplierGridOptions: GridOptions[] = [];
  supplierColumnDefs: Array<ColDef[]> = [];

  vendorProfileGridOptions: GridOptions;
  vendorProfileColumnDefs;

  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  type;
  maxNum = 3;
  selectableCount;
  referenceFiles: ReferenceFile[];
  referenceFileCount = 0;
  matchingProfiles: MatchedProcessProfile[] = [];
  shortListedSuppliers = [];
  removedSuppliers = [];
  selectedSuppliers = [];
  availableSuppliers = [];

  part: Part;
  canReleaseToNewVendorFlag = true;
  canReleaseToVendorFlag = true;

  numberOfVendors = null;
  numberOfVendorsToReleaseToCustomer = 1;
  maxSelectableVendors = null;
  constructor(
    public orderService: OrdersService,
    public metadataService: MetadataService,
    public route: ActivatedRoute,
    public router: Router,
    public partService: PartService,
    public userService: UserService,
    public toastr: ToastrService,
    public modal: NgbModal,
    public pricingService: RfqPricingService
  ) {
    this.type = router.url.split('/')[3];
  }

  ngOnInit() {
    if (this.type === 'project-release-queue') {
      this.initSuppliersTable();
    } else {
      this.initMatchingSuppliersQueue();
    }
    this.initVendorProfileTable();

    combineLatest(
      this.orderService.getAllMeasurementUnitType(),
      this.metadataService.getAdminMetaData(MetadataConfig.POST_PROCESS_ACTION),
      this.pricingService.getProductionProjectSetting()
    ).subscribe(([measurementUnits, postProcessAction, prodProjectSetting]) => {
      this.measurementUnits = measurementUnits.metadataList;
      this.postProcessAction = postProcessAction;

      this.numberOfVendors = prodProjectSetting.minNumberOfSupplierToRelease;
      this.numberOfVendorsToReleaseToCustomer = prodProjectSetting.minNumberOfSupplierToRelease;
    });

    this.route.params.subscribe(({ id }) => {
      this.orderService.getPartById(id).subscribe(v => {
        this.part = v;

        this.getReferenceFileCount();

        if (v.partStatusType.id === 18) {
          // PART_AWAITING_RELEASE
          if (this.type !== 'project-release-queue') {
            this.router.navigateByUrl(`/projects/project-release-queue/${id}`);
          }
        } else if (v.partStatusType.id === 15) {
          // vendor-confirmation-queue
          if (this.type !== 'vendor-confirmation-queue') {
            this.router.navigateByUrl(`/projects/vendor-confirmation-queue/${id}`);
          }
        } else {
          if (this.type !== 'released-projects') {
            this.router.navigateByUrl(`/projects/released-projects/${id}`);
          }
        }
        this.supplierGridOptions[0].api.showLoadingOverlay();
        this.orderService.getMatchingProcessProfiles([this.part.rfqMedia.id]).subscribe(
          res => {
            this.matchingProfiles = res;
            this.shortListedSuppliers = Array.from(new Set(this.matchingProfiles.map(item => item.vendorId))).map(
              (vendorId, index) => {
                const group = this.matchingProfiles.filter(item => item.vendorId === vendorId);
                return {
                  vendorId,
                  id: index + 1,
                  vendorName: group[0].corporateName,
                  numberOfProfiles: group.length,
                  subscription: group[0].subscriptionType,
                  subscriptionId: group[0].subscriptionId
                };
              }
            );
            // Count SHOPSIGHT 360 PLUS SUBSCRIBERS
            this.maxSelectableVendors = this.shortListedSuppliers.filter(i => i.subscriptionId === 4).length;
            this.supplierGridOptions[0].api.hideOverlay();

            if (this.type !== 'project-release-queue') {
              this.setSuppliers(id);
            }
          },
          err => {
            console.log({ err });
            this.supplierGridOptions[0].api.hideOverlay();
          }
        );
      });
    });
  }

  initSuppliersTable() {
    this.supplierColumnDefs = [
      [
        {
          headerName: 'No',
          valueGetter: 'node.rowIndex + 1',
          width: 80,
          hide: false,
          sortable: false,
          filter: false,
          checkboxSelection: true,
          rowDrag: true
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: 'Subscription Type',
          field: 'subscription',
          hide: false,
          sortable: false,
          filter: false,
          valueFormatter: v => (v.value ? v.value.replace(/_/g, ' ') : '-')
        },
        {
          headerName: 'Quantity of Process Profiles',
          field: 'numberOfProfiles',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.removeCell
          },
          width: 200,
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
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
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.moveCell
          },
          width: 200,
          hide: false,
          sortable: false,
          filter: false
        }
      ]
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
        isRowSelectable: rowNode => {
          // Only allow SHOPSIGHT 360 PLUS SUBSCRIBERS
          return rowNode.data && rowNode.data.subscriptionId ? rowNode.data.subscriptionId === 4 : false;
        },
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
            // if (ev.api.getSelectedRows().length > this.maxNum) {
            //   this.toastr.warning(`You can select up to ${this.maxNum} suppliers.`);
            //   ev.node.setSelected(false);
            // } else {
            // }
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
      }
    ];
  }

  initMatchingSuppliersQueue() {
    this.supplierColumnDefs = [
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
          headerName: 'Vendor Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: 'Quantity of Process Profiles',
          field: 'numberOfProfiles',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Status',
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.statusCell
          },
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: 'No',
          valueGetter: 'node.rowIndex + 1',
          checkboxSelection: v => v.data.subscription === 'SHOPSIGHT_360_PLUS',
          width: 30
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.vendorCell
          }
        },
        {
          headerName: 'Quantity of Process Profiles',
          field: 'numberOfProfiles',
          hide: false,
          sortable: false,
          filter: false
        }
      ]
    ];

    this.supplierGridOptions = [
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.supplierColumnDefs[0],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.supplierColumnDefs[1],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
            if (ev.data.subscription !== 'SHOPSIGHT_360_PLUS') {
              this.toastr.warning(`This vendor doesn’t have 360 PLUS.`);
              ev.node.setSelected(false);
            } else if (ev.api.getSelectedRows().length > this.selectableCount) {
              this.toastr.warning(`You can select up to ${this.selectableCount} suppliers.`);
              ev.node.setSelected(false);
            } else {
            }
          }
        }
      }
    ];
  }

  initVendorProfileTable() {
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

    this.vendorProfileGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.vendorProfileColumnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  onSuppliersGridReady(index, ev) {
    this.supplierGridOptions[index].api = ev.api;
    this.supplierGridOptions[index].api.sizeColumnsToFit();
  }

  onVendorProfileReady(ev) {
    this.vendorProfileGridOptions.api = ev.api;
    this.vendorProfileGridOptions.api.sizeColumnsToFit();
  }

  onRowDrag(ev) {
    const overNode = ev.overNode;
    const popIndex = this.shortListedSuppliers.findIndex(item => item.id === overNode.data.id);
    const pushIndex = ev.overIndex;
    this.shortListedSuppliers.splice(popIndex, 1);
    this.shortListedSuppliers.splice(pushIndex, 0, overNode.data);
  }

  preparePostProcessValues(ids: Array<number>) {
    return Util.preparePostProcessValues(this.postProcessAction, ids || []);
  }

  removeFromList(data) {
    this.removedSuppliers = [...this.removedSuppliers, data];
    this.shortListedSuppliers = this.shortListedSuppliers.filter(item => item.id !== data.id);
    if (data.subscriptionId === 4) {
      --this.maxSelectableVendors;
    }
  }

  moveToList(data) {
    this.shortListedSuppliers = [...this.shortListedSuppliers, data];
    this.removedSuppliers = this.removedSuppliers.filter(item => item.id !== data.id);
    if (data.subscriptionId === 4) {
      ++this.maxSelectableVendors;
    }
  }

  showVendorProfiles(ev, data) {
    ev.stopPropagation();

    this.selectedVendor = data;
    this.modal.open(this.vendorProfileModal, {
      centered: true,
      size: 'lg'
    });
  }

  openNewSupplier() {
    this.availableSuppliers = this.shortListedSuppliers.filter(
      v => this.selectedSuppliers.find(s => s.vendorId === v.vendorId) === undefined
    );
    this.modal.open(this.addSupplier, {
      centered: true,
      size: 'lg'
    });
  }

  get vendorProfiles() {
    return this.matchingProfiles.filter(item => item.vendorId === this.selectedVendor.vendorId);
  }

  releaseToVendor() {
    const selectedProfiles = this.supplierGridOptions[0].api
      .getSelectedRows()
      .map(item => ({
        selectedProcessProfileId: null,
        vendorId: item.vendorId,
        releasePriority: this.shortListedSuppliers.findIndex(s => s.vendorId === item.vendorId) + 1
      }))
      .sort((a, b) => a.releasePriority - b.releasePriority);
    this.canReleaseToVendorFlag = false;
    this.orderService.releaseProjectBidToVendor(this.part.id, selectedProfiles).subscribe(
      v => {
        this.router.navigateByUrl(`/projects/vendor-confirmation-queue/${v.partId}`);
        this.canReleaseToVendorFlag = true;
      },
      err => {
        this.canReleaseToVendorFlag = true;
        this.toastr.error('Vendor not subscribed to SHOPSIGHT 360 PLUS selected.');
      }
    );
  }

  releaseNewToVendor() {
    const selectedProfiles = this.supplierGridOptions[1].api
      .getSelectedRows()
      .map(item => ({
        selectedProcessProfileId: null,
        vendorId: item.vendorId,
        releasePriority: this.shortListedSuppliers.findIndex(s => s.vendorId === item.vendorId) + 1
      }))
      .sort((a, b) => a.releasePriority - b.releasePriority);

    this.canReleaseToNewVendorFlag = false;
    this.orderService.releaseProjectBidToVendor(this.part.id, selectedProfiles).subscribe(
      v => {
        this.setSuppliers(v.partId);
        this.modal.dismissAll();
      },
      err => {
        this.canReleaseToNewVendorFlag = true;
      }
    );
  }

  releaseToCustomer() {
    this.orderService
      .releaseProjectBidToCustomer(
        this.part.id,
        this.selectedSuppliers.filter(item => item.status.id === 2).map(item => item.vendorId)
      )
      .subscribe(v => {
        this.router.navigateByUrl(`/projects/released-projects/${this.part.id}`);
      });
  }

  setSuppliers(partId) {
    this.supplierGridOptions[0].api.showLoadingOverlay();
    this.orderService.getBidProjectProcesses(partId).subscribe(
      v => {
        this.selectableCount = 3 - v.filter(item => item.bidProjectProcessStatusType.id !== 3 /* REJECTED */).length;
        this.selectedSuppliers = v.map(res => {
          const group = this.matchingProfiles.filter(item => item.vendorId === res.vendorId);

          return {
            id: res.id,
            vendorId: res.vendorId,
            vendorName: res.vendorName,
            numberOfProfiles: group.length,
            status: res.bidProjectProcessStatusType
          };
        });
        this.supplierGridOptions[0].api.hideOverlay();
      },
      err => {
        console.log({ err });
        this.supplierGridOptions[0].api.hideOverlay();
      }
    );
  }

  canReleaseToCustomer() {
    return (
      this.numberOfVendorsToReleaseToCustomer &&
      this.selectedSuppliers.filter(item => item.status.id === 2).length >= this.numberOfVendorsToReleaseToCustomer
    );
  }

  canReleaseToVendor() {
    return (
      this.supplierGridOptions[0].api &&
      this.numberOfVendors !== null &&
      this.supplierGridOptions[0].api.getSelectedRows().length >= this.numberOfVendors &&
      this.canReleaseToVendorFlag
    );
  }

  getReferenceFileCount() {
    this.orderService.getReferenceFileCountByPartId(this.part.id).subscribe(
      res => {
        this.referenceFileCount = res;
      },
      err => {}
    );
  }

  openReference() {
    this.orderService.getReferenceFiles(this.part.id).subscribe(v => {
      this.referenceFiles = v;
      this.modal.open(this.reference, {
        centered: true,
        size: 'lg'
      });
    });
  }
}
