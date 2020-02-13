import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
      name: 'Purchase Order', checked: true, field: 'purchaseOrder'
    },
    {
      name: 'Note', checked: true, field: 'note'
    }
  ];

  status = [
    {
      displayName: 'All Type Of Payment',
      id: 1
    },
    {
      displayName: 'Purchase Order',
      id: 2
    }, {
      displayName: 'Credit Card',
      id: 3
    }
  ];

  type = ['search', 'filter'];

  columnDefs: ColDef[] = [];

  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };


  rowData = [];
  pageSize = 10;

  navigation;

  selectedPurchaseOrderId = null;

  form: FormGroup = this.fb.group({
    orderNo: [null],
    paymentStatus: [1],
    comment: ['']
  });


  pageType = '';

  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public toastr: ToastrService,
    public fb: FormBuilder,
    public modalService: NgbModal
  ) {
    this.navigation = this.route.getCurrentNavigation();
    const routeArr = this.route.url
      .slice(
        this.route.url.indexOf("/billing/payment/") + "/billing/payment/".length
      )
      .split("/");

    this.pageType = routeArr[0];

  }


  ngOnInit() {
    // this.spineer.show();

    this.getProfiles();

    this.setGridColumns('waiting-for-approval' === this.pageType);


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
    console.log(this.form.value.comment);
    this.toastr.success('Purchase ' + this.selectedPurchaseOrderId + ' Rejected.');
    this.modalService.dismissAll();
    this.selectedPurchaseOrderId = null;
    this.form.controls.comment.setValue('');
  }
  getProfiles() {
    this.rowData = [
      {
        id: 1,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      },
      {
        id: 2,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      },
      {
        id: 3,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      },
      {
        id: 4,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      }, {
        id: 5,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      }
      , {
        id: 6,
        customerName: 'Printing Co',
        orderId: '1234',
        purchaseOrder: '123456',
        note: 'I submitted my PO. Please Accept it.',
        paymentType: 'Purchase Order',
        status: 'Approved'
      }
    ];
  }

  setGridColumns(waitingForApproval = false) {
    this.columnDefs = [
      { headerName: 'Customer Name', field: 'customerName', hide: false, sortable: true, filter: false },
      {
        headerName: 'Customer Order ID', field: 'orderId',
        hide: false, sortable: true, filter: false,
      },
      {
        headerName: 'Purchase Order', field: 'purchaseOrder',
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

