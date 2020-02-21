import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillingService } from 'src/app/service/billing.service';
import { PaymentStatusType, Payment } from 'src/app/model/billing.model';
import { FilterOption } from 'src/app/model/vendor.model';

@Component({
  selector: 'app-waiting-for-approval',
  templateUrl: './waiting-for-approval.component.html',
  styleUrls: ['./waiting-for-approval.component.css']
})
export class WaitingForApprovalComponent implements OnInit {

  @ViewChild('viewAllInfo') viewAllInfo: TemplateRef<any>;
  @ViewChild('approveRejectAction') approveRejectAction: TemplateRef<any>;


  tableControlReady = false;

  searchColumns = [
    {
      name: 'Customer Name', checked: false, field: 'customerName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Customer Order ID', checked: false,
      field: 'orderId', query: {
        type: '',
        filter: '',
      },
      resizeable: true,
    },
    {
      name: 'Note', checked: false,
      field: 'note', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Payment Type', checked: false,
      field: 'paymentType', query: {
        type: '',
        filter: '',
      }
    }
  ];

  filterColumns = [
    {
      name: 'Customer Name', checked: true, field: 'customerName'
    },
    {
      name: 'Customer Order ID', checked: true, field: 'orderId'
    },
    {
      name: 'Purchase Order', checked: true, field: 'poNumber'
    },
    {
      name: 'Note', checked: true, field: 'note'
    }
  ];

  status = [
    {
      displayName: 'All Type Of Payment',
      id: null
    },
    {
      displayName: 'Purchase Order',
      id: 'PURCHASE_ORDER'
    }, {
      displayName: 'Credit Card',
      id: 'CREDIT_CARD'
    }
  ];

  type = ['search', 'filter'];

  columnDefs: ColDef[] = [];

  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };


  rowData;
  pageSize = 10;

  navigation;

  selectedPurchaseOrderId = null;

  form: FormGroup = this.fb.group({
    orderNo: [null],
    paymentType: ['PURCHASE_ORDER'],
    comment: ['']
  });


  pageType: PaymentStatusType = PaymentStatusType.WAITING_FOR_APPROVAL;

  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public toastr: ToastrService,
    public fb: FormBuilder,
    public modalService: NgbModal,
    public billingService: BillingService
  ) {
    this.navigation = this.route.getCurrentNavigation();
    const routeArr = this.route.url
      .slice(
        this.route.url.indexOf("/billing/payment/") + "/billing/payment/".length
      )
      .split("/");

    switch (routeArr[0]) {
      case 'waiting-for-approval':
        this.pageType = PaymentStatusType.WAITING_FOR_APPROVAL;
        break;
      case 'approved':
        this.pageType = PaymentStatusType.APPROVED;
        break;
      case 'waiting-for-approval':
        this.pageType = PaymentStatusType.REJECTED;
        break;
      default:
        break;
    }

  }


  ngOnInit() {
    // this.spineer.show();


    this.setGridColumns(PaymentStatusType.WAITING_FOR_APPROVAL === this.pageType);

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
        result => { },
        reason => { }
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

  approvePurchase() {
    this.toastr.success('Purchase ' + this.selectedPurchaseOrderId + ' Approved.');
    this.modalService.dismissAll();
    this.selectedPurchaseOrderId = null;
  }

  rejectPurchase() {

    this.toastr.success('Purchase ' + this.selectedPurchaseOrderId + ' Rejected.');
    this.modalService.dismissAll();
    this.selectedPurchaseOrderId = null;
    this.form.controls.comment.setValue('');
  }
  getProfiles() {
    const body: Payment = {
      id: null,
      customerName: null,
      orderId: this.form.value.orderNo || null,
      paymentStatusType: this.pageType,
      paymentType: this.form.value.paymentType,
      poNumber: null,
      note: null
    };
    const filter: FilterOption = { size: 1000, sort: "id,ASC", page: 0, q: "" };
    if (this.gridOptions) {
      this.gridOptions.api.showLoadingOverlay();
    }

    this.billingService.getPaymentList(body, filter)
      .subscribe((res: any) => {
        console.log({ res });
        this.rowData = res.content;
        if (this.gridOptions) {
          this.gridOptions.api.hideOverlay();
        }
      });

  }

  setGridColumns(waitingForApproval = false) {
    this.columnDefs = [
      { headerName: 'Customer Name', field: 'customerName', hide: false, sortable: true, filter: false },
      {
        headerName: 'Customer Order ID', field: 'orderId',
        hide: false, sortable: true, filter: false,
      },
      {
        headerName: 'Purchase Order', field: 'poNumber',
        hide: false, sortable: true, filter: false,
      },
      { headerName: 'Note', field: 'note', hide: false, sortable: true, filter: false },
      {
        headerName: 'Payment Type', field: 'paymentType', hide: true, sortable: true, filter: false,
      },
      {
        headerName: '', field: '',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.viewAllInfo
        },
        hide: false, sortable: false, filter: false,
        width: 160
      },
      {
        headerName: 'Action', field: '',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.approveRejectAction
        },
        hide: false, sortable: false, filter: false,
        width: 140
      }
    ];

    if (!waitingForApproval) {
      this.columnDefs.pop();
      this.columnDefs.splice(5, 0, {
        headerName: 'Status', field: 'status',
        hide: false, sortable: false, filter: false,
      });
    }
  }
}

