import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { ProjectService } from 'src/app/service/project.service';
import { BidProcessStatusEnum, ConnectProject } from '../../../../model/connect.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchedProcessProfile, Part } from 'src/app/model/part.model';
import { OrdersService } from 'src/app/service/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, map, tap } from 'rxjs/operators';
import { PartService } from 'src/app/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { MetadataService } from 'src/app/service/metadata.service';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { DefaultEmails } from '../../../../../assets/constants';
import { SubscriptionTypeEnum } from '../../../../model/subscription.model';

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

  selectedVendor = null;
  firstTimeRelease = true;
  replacementProdexSuppliers;
  selectedProdEXVendorIds = [];
  selectedInviteVendorIds = [];
  selectedReplacementProdEXVendorIds = [];

  matchingProfiles: MatchedProcessProfile[] = [];

  projectDetails: ConnectProject;
  statusTypes = BidProcessStatusEnum;
  customerOrderId;
  pageType;
  showPartDetails = false;
  unitOptions = [];

  from = DefaultEmails.from;
  to = DefaultEmails.to;
  cc = [];
  bcc = [];

  constructor(
    public projectService: ProjectService,
    public partService: PartService,
    public orderService: OrdersService,
    public modal: NgbModal,
    public route: ActivatedRoute,
    public router: Router,
    public spineer: NgxSpinnerService,
    public toaster: ToastrService,
    public location: Location,
    public metadataService: MetadataService,
    public modalService: NgbModal
  ) {
    this.customerOrderId = this.route.snapshot.paramMap.get('id');
    this.route.url.subscribe(r => {
      this.pageType = r[0].path;
    });
    localStorage.removeItem('admin-RegisterMachines');
    localStorage.removeItem('admin-RegisterVendor');
    localStorage.removeItem('admin-RegisterUser');
    localStorage.removeItem('connect-registration');
  }

  ngOnInit() {
    this.metadataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.unitOptions = res;
    });
    this.initColumnDefs();
    this.initGridOptions();
    this.getData();
  }

  get selectableProdexSuppliers() {
    return (this.projectDetails.prodexSuppliers || []).filter(
      supplier => supplier.subscriptionType === SubscriptionTypeEnum.SHOPSIGHT_360_PLUS
    ).length;
  }

  get vendorProfiles() {
    return this.matchingProfiles.filter(item => item.vendorId === this.selectedVendor.vendorId);
  }

  get canReleaseToSelectedProdEXSuppliers() {
    return (
      this.projectDetails &&
      this.selectedProdEXVendorIds.length === this.projectDetails.minimumProdexSuppliers &&
      this.pageType === 'release-queue'
    );
  }

  get canReleaseToInvitedEXSuppliers() {
    return (
      this.pageType === 'release-queue' &&
      this.supplierGridOptions.length &&
      this.supplierGridOptions[2].api &&
      this.projectDetails &&
      this.selectedInviteVendorIds.length &&
      (this.supplierGridOptions[2].api.getSelectedNodes() || []).length
    );
  }

  sendMail(ev) {
    this.bcc = ev ? [ev.email] : [];
    this.modalService.open(this.sendMailModal, {
      centered: true,
      size: 'lg'
    });
  }

  createVendorProfile(row) {
    localStorage.setItem('connect-registration', this.router.url);
    localStorage.setItem(
      'admin-RegisterUser',
      JSON.stringify({
        email: row.email || '',
        firstName: row.name || '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phone: row.phoneNo || ''
      })
    );
    this.router.navigateByUrl('/user-manage/add-vendor/user');
  }

  getData() {
    this.spineer.show();
    this.projectService
      .getConnectProject(this.customerOrderId)
      .pipe(
        tap(_ => {
          this.firstTimeRelease = (_.prodexSuppliers || []).filter(supplier => !!supplier.status).length === 0;
        }),
        mergeMap(project =>
          this.partService.getPartsById(project.partIds || []).pipe(
            tap(async partList => {
              this.orderService
                .getMatchingProcessProfiles([partList[0].rfqMediaId], false)
                .subscribe(profiles => (this.matchingProfiles = profiles));
            }),
            map(parts => {
              return { ...project, parts };
            })
          )
        )
      )
      .subscribe(
        r => {
          this.replacementProdexSuppliers = r
            ? this.firstTimeRelease
              ? []
              : (r.prodexSuppliers || []).filter(supplier => !supplier.status)
            : [];

          this.projectDetails = {
            ...r,
            customerInvitedSuppliers: r.customerInvitedSuppliers || [],
            prodexSuppliers: r
              ? this.firstTimeRelease
                ? r.prodexSuppliers || []
                : r.prodexSuppliers.filter(supplier => !!supplier.status)
              : [],
            customerSelectedSuppliers: r.customerSelectedSuppliers || []
          };
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
            r.error &&
            ((r.error.message || '').includes(SubscriptionTypeEnum.SHOPSIGHT_360_PLUS) ||
              (r.error.message || '').includes('Contract not found'))
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

  releaseProjectToInvite() {
    this.spineer.show();
    this.projectService
      .releaseConnectProjectToInvite(this.projectDetails.customerOrderId, this.selectedInviteVendorIds)
      .subscribe(
        r => {
          this.selectedInviteVendorIds = [];
          this.supplierGridOptions[2].api.deselectAll();
          this.spineer.hide();
          this.toaster.success('Project Released To Invited Suppliers');
          this.getData();
        },
        err => {
          this.spineer.hide();
          this.selectedInviteVendorIds = [];
          this.supplierGridOptions[2].api.deselectAll();
          if (
            err.error &&
            ((err.error.message || '').includes(SubscriptionTypeEnum.SHOPSIGHT_360_PLUS) ||
              (err.error.message || '').includes('Contract not found'))
          ) {
            this.toaster.error("User doesn't have SHOPSIGHT 360 PLUS");
          } else {
            this.toaster.error('Error While Releasing Project To Invited Suppliers.');
          }
          this.getData();
          console.log(err);
        }
      );
  }
  replaceSupplier() {
    this.spineer.show();
    this.projectService
      .replaceConnectProjectSupplier(
        this.projectDetails.customerOrderId,
        this.selectedVendor.vendorId,
        this.selectedReplacementProdEXVendorIds[0]
      )
      .subscribe(
        r => {
          this.selectedVendor = null;
          this.selectedReplacementProdEXVendorIds = [];
          this.vendorProfileGridOptions[1].api.deselectAll();
          this.modal.dismissAll();
          this.spineer.hide();
          this.toaster.success('Suppliers Replaced');
          this.getData();
        },
        r => {
          this.spineer.hide();
          this.selectedReplacementProdEXVendorIds = [];
          this.vendorProfileGridOptions[1].api.deselectAll();
          if (
            r.error &&
            ((r.error.message || '').includes(SubscriptionTypeEnum.SHOPSIGHT_360_PLUS) ||
              (r.error.message || '').includes('Contract not found'))
          ) {
            this.toaster.error("Vendor doesn't have SHOPSIGHT 360 PLUS");
          } else {
            this.toaster.error('Error While Replacing Suppliers.');
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
        rowHeight: 35,
        headerHeight: 35,
        paginationPageSize: 10,
        domLayout: 'autoHeight'
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.replacementProfileColumnDefs,
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        paginationPageSize: 10,
        isRowSelectable: rowNode => {
          return this.hasCorrectSub(rowNode.data.subscriptionType) && this.pageType === 'release-queue';
        },
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
            this.selectedReplacementProdEXVendorIds.push(ev.data.vendorId);
          } else {
            const foundIndex = this.selectedReplacementProdEXVendorIds.findIndex(_ => _ === ev.data.vendorId);
            if (foundIndex !== -1) {
              this.selectedReplacementProdEXVendorIds.splice(foundIndex, 1);
            }
          }
        }
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
        localeText: {
          noRowsToShow: 'No ProdEX supplier found. Please check ProdEX supplier has ShopSight 360 Plus subscription.'
        },
        domLayout: 'autoHeight',
        isRowSelectable: rowNode => {
          return (
            !rowNode.data.status &&
            this.hasCorrectSub(rowNode.data.subscriptionType) &&
            this.firstTimeRelease &&
            this.pageType === 'release-queue'
          );
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
        localeText: { noRowsToShow: 'No Customer Supplier Selected.' },
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
        localeText: { noRowsToShow: 'Customer Invited No Supplier.' },
        isRowSelectable: rowNode => {
          return rowNode.data.isRegistered && this.pageType === 'release-queue';
        },
        onRowSelected: ev => {
          if (ev.node.isSelected()) {
            this.selectedInviteVendorIds.push(ev.data.id);
          } else {
            const foundIndex = this.selectedInviteVendorIds.findIndex(_ => _ === ev.data.id);
            if (foundIndex !== -1) {
              this.selectedInviteVendorIds.splice(foundIndex, 1);
            }
          }
        }
      }
    ];
  }

  hasCorrectSub(subscriptionType) {
    return subscriptionType == SubscriptionTypeEnum.SHOPSIGHT_360_PLUS;
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
        tooltipField: 'processProfileName',
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
        width: 40
      },
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 30
      },
      {
        headerName: 'Vendor',
        field: 'vendor',
        tooltipField: 'vendor',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltipField: 'vendorName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Subscription',
        field: 'subscriptionType',
        tooltipField: 'subscriptionType',
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
          headerName: 'Subscription',
          field: 'subscriptionType',
          tooltipField: 'subscriptionType',
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
          field: 'status',
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
          headerName: 'Subscription',
          field: 'subscriptionType',
          tooltipField: 'subscriptionType',
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
          field: 'status',
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
          field: 'name',
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
          field: 'phoneNo',
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
