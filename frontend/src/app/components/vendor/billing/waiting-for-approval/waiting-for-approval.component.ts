import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { BillingService } from 'src/app/service/billing.service';
import { Payment, PaymentStatusTypes, PaymentType } from 'src/app/model/billing.model';
import { FilterOption } from 'src/app/model/vendor.model';
import { ProjectType } from 'src/app/model/billing.model';
import { MetadataService } from 'src/app/service/metadata.service';

@Component({
  selector: 'app-waiting-for-approval',
  templateUrl: './waiting-for-approval.component.html',
  styleUrls: ['./waiting-for-approval.component.css']
})
export class WaitingForApprovalComponent implements OnInit {
  @ViewChild('viewAllInfo') viewAllInfo: TemplateRef<any>;
  @ViewChild('approveRejectAction') approveRejectAction: TemplateRef<any>;
  @ViewChild('chatCell') chatCell: TemplateRef<any>;

  disableControls = false;
  tableControlReady = false;
  searchColumns = [
    {
      name: 'Customer Name',
      checked: false,
      field: 'customerName',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Customer Order ID',
      checked: false,
      field: 'orderId',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Customer RFQ ID',
      checked: false,
      field: 'rfqId',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Part IDs',
      checked: false,
      field: 'partIds',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Payment No',
      checked: false,
      field: 'poNumber',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Amount',
      checked: false,
      field: 'amount',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Project Type',
      checked: false,
      field: 'projectType',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Payment Type',
      checked: false,
      field: 'paymentType',
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Customer Name',
      checked: true,
      field: 'customerName'
    },
    {
      name: 'Customer Order ID',
      checked: true,
      field: 'orderId'
    },
    {
      name: 'Customer RFQ ID',
      checked: true,
      field: 'rfqId'
    },
    {
      name: 'Part IDs',
      checked: true,
      field: 'partIds'
    },
    {
      name: 'Payment No',
      checked: true,
      field: 'poNumber'
    },
    {
      name: 'Amount',
      checked: true,
      field: 'amount'
    },
    {
      name: 'Project Type',
      checked: true,
      field: 'projectType'
    },
    {
      name: 'Payment Type',
      checked: true,
      field: 'paymentType'
    }
  ];
  // TODO - Read payment info from api
  paymentStatusType = [
    {
      displayName: 'All Type Of Payment',
      id: null
    },
    {
      displayName: 'Purchase Order',
      id: 'PURCHASE_ORDER'
    },
    {
      displayName: 'Credit Card',
      id: 'CREDIT_CARD'
    },
    {
      displayName: 'Zero Dollar Payment',
      id: 'ZERO_DOLLAR_ORDER'
    }
  ];
  projectType = [];
  type = ['search', 'filter'];

  columnDefs: ColDef[] = [];
  paymentOrderType = PaymentType;

  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  rowData;
  pageSize = 10;
  navigation;
  selectedPurchaseOrder = null;
  form: FormGroup = this.fb.group({
    orderNo: [null],
    paymentType: [null],
    projectType: [null],
    comment: ['']
  });
  pageType: PaymentStatusTypes = PaymentStatusTypes.WAITING_FOR_APPROVAL;

  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public toastr: ToastrService,
    public fb: FormBuilder,
    public modalService: NgbModal,
    public billingService: BillingService,
    public metadataService: MetadataService,
    public currencyPipe: CurrencyPipe,
    public titleCasePipe: TitleCasePipe
  ) {
    this.navigation = this.route.getCurrentNavigation();
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('/billing/payment/') + '/billing/payment/'.length)
      .split('/');

    this.metadataService.getMetaData('project_type').subscribe(v => {
      this.projectType = v.map(item => ({ ...item, displayName: ProjectType[item.name] }));
    });

    switch (routeArr[0]) {
      case 'waiting-for-approval':
        this.pageType = PaymentStatusTypes.WAITING_FOR_APPROVAL;
        break;
      case 'approved':
        this.pageType = PaymentStatusTypes.APPROVED;
        break;
      case 'rejected':
        this.pageType = PaymentStatusTypes.REJECTED;
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.setGridColumns(PaymentStatusTypes.WAITING_FOR_APPROVAL === this.pageType);
    this.getProfiles();
    this.tableControlReady = true;
    if (this.type.includes('filter')) {
      this.configureColumnDefs();
    }
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationAutoPageSize: true,
      // paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };

    if (this.navigation && this.navigation.extras.state && this.navigation.extras.state.toast) {
      const toastInfo = this.navigation.extras.state.toast;
      if (toastInfo.type === 'success') {
        this.toastr.success(toastInfo.body);
      } else {
        this.toastr.error(toastInfo.body);
      }
    }
  }

  open(content, size: any = 'lg') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => {},
        reason => {}
      );
  }

  configureColumnDefs() {
    this.filterColumns.map(column => {
      this.columnDefs.map(col => {
        if (col.headerName === column.name) {
          col.hide = !column.checked;
        }
      });
    });
  }

  getPaymentType(row: any) {
    const paymentTypeTitle = this.titleCasePipe.transform(row.paymentType.replace(/_/g, ' '));
    return `${row.paymentType === this.paymentOrderType.CREDIT_CARD ? `${paymentTypeTitle} Order` : paymentTypeTitle}`;
  }

  autoFitColumns() {
    this.gridOptions.columnApi.autoSizeColumns(['name']);
    this.gridOptions.api.sizeColumnsToFit();
  }

  pageSizeChanged(value) {
    this.gridOptions.paginationAutoPageSize = false;
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(event) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: '', filter: '' });
        }
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  filterColumnsChange(event) {
    this.reconfigColumns();
    this.searchColumnsChange({});
  }

  reconfigColumns() {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  approve() {
    this.disableControls = true;
    this.spineer.show();
    this.billingService.approve(this.selectedPurchaseOrder.orderId).subscribe(
      res => {
        this.onCloseData();
        this.getProfiles();
        this.toastr.success('Purchase Approved.');
      },
      err => {
        if (this.selectedPurchaseOrder.paymentType === PaymentType.CREDIT_CARD) {
          if ((err.error.message || '').toLowerCase().indexOf('your card was declined')) {
            this.toastr.error('Credit card transaction failed. Please talk to customer');
          } else {
            this.toastr.error('Error While Approving Purchase.');
          }
        } else {
          this.toastr.error('Error While Approving Purchase.');
        }
        this.onCloseData();
      }
    );
  }

  onCloseData() {
    this.selectedPurchaseOrder = null;
    this.disableControls = false;
    this.modalService.dismissAll();
    this.spineer.hide();
  }

  reject() {
    this.disableControls = true;
    this.spineer.show();
    this.billingService.reject(this.selectedPurchaseOrder.orderId).subscribe(
      result => {
        this.onCloseData();
        this.getProfiles();
        this.toastr.success('Purchase Rejected.');
      },
      err => {
        this.onCloseData();
        this.toastr.error('Error While Rejecting Purchase.');
      }
    );
  }

  getProfiles() {
    const body: Payment = {
      id: null,
      customerName: null,
      orderId: this.form.value.orderNo || null,
      paymentStatusType: this.pageType,
      paymentType: this.form.value.paymentType == 'null' ? null : this.form.value.paymentType,
      projectType: this.form.value.projectType === 'null' ? null : this.form.value.projectType,
      poNumber: null,
      note: null
    };
    const filter: FilterOption = { size: 1000, sort: 'id,ASC', page: 0, q: '' };
    if (this.gridOptions) {
      this.gridOptions.api.showLoadingOverlay();
    }
    this.billingService.getPaymentList(body, filter).subscribe((res: any) => {
      this.rowData = res.content;
      if (this.gridOptions) {
        this.gridOptions.api.hideOverlay();
      }
    });
  }

  setGridColumns(waitingForApproval = false) {
    this.columnDefs = [
      {
        headerName: 'Customer Name',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Customer Order ID',
        field: 'orderId',
        hide: false,
        sortable: true,
        filter: false,
        sort: 'asc',
        width: 100
      },
      {
        headerName: 'Customer RFQ ID',
        field: 'projectRfqId',
        hide: false,
        sortable: true,
        filter: false,
        width: 100
      },
      {
        headerName: 'Part IDs',
        field: 'partIds',
        hide: false,
        sortable: true,
        filter: false,
        width: 100,
        valueFormatter: v => v && v.value && v.value.join(',')
      },
      {
        headerName: 'Payment No',
        field: 'poNumber',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Amount',
        field: 'amount',
        hide: false,
        sortable: true,
        filter: false,
        width: 100,
        valueFormatter: v => v && v.value && this.currencyPipe.transform(v.value || 0, 'USD', 'symbol', '0.0-3')
      },
      {
        headerName: 'Project Type',
        field: 'projectType',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: v =>
          v &&
          v.value &&
          (v.data.oldProjectType ? ProjectType[v.value + '_' + v.data.oldProjectType] : ProjectType[v.value])
      },
      {
        headerName: 'Payment Type',
        field: 'paymentType',
        hide: true,
        sortable: true,
        filter: false,
        valueFormatter: val => {
          const result = (val.data.paymentType || '').replace(/_/g, ' ').toLowerCase();
          if (result.length) {
            return result[0].toUpperCase() + result.substr(1);
          }
          return result;
        }
      },
      {
        headerName: 'Note',
        field: 'note',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.chatCell
        }
      },
      {
        headerName: '',
        field: '',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.viewAllInfo
        },
        hide: false,
        sortable: false,
        filter: false,
        width: 100,
        suppressSizeToFit: true
      },
      {
        headerName: 'Action',
        field: '',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.approveRejectAction
        },
        hide: false,
        sortable: false,
        filter: false,
        width: 150,
        suppressSizeToFit: true
      }
    ];
    if (!waitingForApproval) {
      this.columnDefs.pop();
      this.columnDefs.splice(5, 0, {
        headerName: 'Status',
        field: 'status',
        hide: false,
        sortable: false,
        filter: false,
        valueFormatter: val => {
          const result = (val.data.paymentStatusType || '').replace(/_/g, ' ').toLowerCase();
          if (result.length) {
            return result[0].toUpperCase() + result.substr(1);
          }
          return result;
        }
      });
    }
  }
}
