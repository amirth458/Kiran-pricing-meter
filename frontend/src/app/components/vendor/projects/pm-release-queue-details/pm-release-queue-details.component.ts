import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest } from 'rxjs';

import { BiddingService } from '../../../../service/bidding.service';
import { ProjectService } from 'src/app/service/project.service';
import { PartService } from 'src/app/service/part.service';
import { ConnectProject } from 'src/app/model/connect.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { ReferenceFile, Part, MatchedProcessProfile } from 'src/app/model/part.model';
import { SubscriptionTypeIdEnum } from 'src/app/model/subscription.model';
import { OrdersService } from 'src/app/service/orders.service';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { Util } from 'src/app/util/Util';

@Component({
  selector: 'app-pm-release-queue-details',
  templateUrl: './pm-release-queue-details.component.html',
  styleUrls: ['./pm-release-queue-details.component.css']
})
export class PmReleaseQueueDetailsComponent implements OnInit {
  @ViewChild('removeCell') removeCell: TemplateRef<any>;
  @ViewChild('moveCell') moveCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('vendorCell') vendorCell: TemplateRef<any>;
  @ViewChild('vendorProfile') vendorProfileModal: TemplateRef<any>;
  @ViewChild('addSupplier') addSupplier: TemplateRef<any>;
  @ViewChild('reference') reference: TemplateRef<any>;

  suppliers = [];
  showPartDetails = false;
  projectDetails: ConnectProject;
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
  parts: Part[];
  canReleaseToNewVendorFlag = true;
  canReleaseToVendorFlag = true;
  bidPmProjectId = null;
  numberOfVendors = null;
  numberOfVendorsToReleaseToCustomer = 1;
  maxSelectableVendors = null;

  constructor(
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public router: Router,
    public modal: NgbModal,
    public metadataService: MetadataService,
    public projectService: ProjectService,
    public orderService: OrdersService,
    public partService: PartService,
    public pricingService: RfqPricingService,
    public biddingService: BiddingService
  ) {
    this.type = router.url.split('/')[3];
  }

  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(params => {
      this.bidPmProjectId = params.bidId;
      this.getPartsByBidPmProjectId();
    });

    if (this.type === 'pm-release-queue') {
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
  }

  getPartsByBidPmProjectId() {
    this.biddingService.getPartsByBidPmProjectId(this.bidPmProjectId).subscribe(
      parts => {
        this.spinner.hide();
        if (!(parts || []).length) {
          return;
        }
        this.parts = parts || [];
        this.getAllSuppliersInfo(this.parts.map(part => part.partId));
      },
      error => {
        this.spinner.hide();
        console.log('Error', error);
      }
    );
  }

  getAllSuppliersInfo(partIds: Array<number>) {
    this.projectService.getAllSuppliersAndPartId(partIds).subscribe(suppliers => {
      this.shortListedSuppliers = (suppliers || []).map((item, index) => {
        const facilityCertificates = item.facilityCertificates.map(facility => facility.name);
        const partCertificates = item.partCertificates.map(partCert => partCert.name);
        return {
          ...item,
          vendorName: item.vendorName,
          vendorType: item.vendorType.name,
          country: item.country.name,
          quantityOfProcessProfile: item.quantityOfProcessProfile,
          facility: item.facility.toString(),
          facilityCertificates: facilityCertificates.toString(),
          partCertificates: partCertificates.toString(),
          releasePriority: index + 1
        };
      });
    });
  }

  isManufacturerSameVendor() {
    return this.part && this.part.order && this.part.order.isReleaseToSingleSupplier;
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

  releaseToVendor() {
    this.spinner.show('loadingPanel');
    const selectedProfiles = this.supplierGridOptions[0].api
      .getSelectedRows()
      .map(item => ({
        vendorId: item.vendorId,
        releasePriority: this.shortListedSuppliers.findIndex(s => s.vendorId === item.vendorId) + 1
      }))
      .sort((a, b) => a.releasePriority - b.releasePriority);

    this.canReleaseToVendorFlag = false;
    const payload = {
      bidPmProjectId: this.bidPmProjectId,
      releaseBidPmProjectToVendors: selectedProfiles
    };
    this.projectService.saveReleasePMBidToVendor(payload).subscribe(
      response => {
        this.spinner.hide('loadingPanel');
        this.toastr.success('Successfully released!');
        /* todo Redirect to next view */
      },
      error => {
        this.spinner.hide('loadingPanel');
        this.toastr.error('Error while releasing to Vendor.');
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
        this.router.navigateByUrl(`/prodex/projects/released-projects/${this.part.id}`);
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

  /* Table configuration */

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
          headerName: 'Vendor Type',
          field: 'vendorType',
          hide: false,
          sortable: false,
          filter: false
          // valueFormatter: v => (v.value ? v.value.name : '-')
        },
        {
          headerName: 'country',
          field: 'country',
          hide: false,
          sortable: false,
          filter: false
          // valueFormatter: v => (v.value ? v.value.name : '-')
        },
        {
          headerName: 'Facility',
          field: 'facility',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Facility Certificates',
          field: 'facilityCertificates',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Part Certificates',
          field: 'partCertificates',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Quanitity of Process Profile',
          field: 'quantityOfProcessProfile',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'ReleasePriority',
          field: 'releasePriority',
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
          return true;
          // Only allow SHOPSIGHT 360 PLUS SUBSCRIBERS
          return rowNode.data && rowNode.data.subscriptionId
            ? rowNode.data.subscriptionId === SubscriptionTypeIdEnum.SHOPSIGHT_360_PLUS
            : false;
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
          // checkboxSelection: v => v.data.subscriptionId === SubscriptionTypeIdEnum.SHOPSIGHT_360_PLUS,
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
            // if (ev.api.getSelectedRows().length > this.selectableCount) {
            //   this.toastr.warning(`You can select up to ${this.selectableCount} suppliers.`);
            //   ev.node.setSelected(false);
            // }
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
    this.shortListedSuppliers = this.shortListedSuppliers.filter(item => item.vendorId !== data.vendorId);
    // if (data.subscriptionId === SubscriptionTypeIdEnum.SHOPSIGHT_360_PLUS) {
    --this.maxSelectableVendors;
    // }
  }

  moveToList(data) {
    this.shortListedSuppliers = [...this.shortListedSuppliers, data];
    this.removedSuppliers = this.removedSuppliers.filter(item => item.vendorId !== data.vendorId);
    // if (data.subscriptionId === SubscriptionTypeIdEnum.SHOPSIGHT_360_PLUS) {
    ++this.maxSelectableVendors;
    // }
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
}
