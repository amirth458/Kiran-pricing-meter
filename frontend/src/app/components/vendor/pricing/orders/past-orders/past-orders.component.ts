import { OrdersService } from './../../../../../service/orders.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.component.html',
  styleUrls: ['./past-orders.component.css']
})
export class PastOrdersComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  columnDefs = [];
  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  navigation;

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    private spinner: NgxSpinnerService,
    private ordersService: OrdersService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: "Customer Order",
        field: "customerOrder",
        hide: false,
        sortable: true,
        filter: false,
      },
      {
        headerName: "Sub-Order",
        field: "subOrder",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: "fileViewRenderer"
      },
      {
        headerName: "Price Accepted",
        field: "priceAccepted",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Customer",
        field: "customer",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Quantity",
        field: "quantity",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Material",
        field: "material",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Process",
        field: "process",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Post-Process",
        field: "postProcess",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Previously Ordered",
        field: "previouslyOrdered",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "First Shipment",
        field: "firstShipment",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Delivery Date",
        field: "deliveryDate",
        hide: false,
        sortable: true,
        filter: false
      },
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
        //console.log('row click', event.data.id);
        //this.router.navigateByUrl(this.router.url + "/" + event.data.id);
        this.modalService.open(this.modalContent, {
          centered: true,
          windowClass: "past-order-modal"
        });
      },
    };
    this.getRows();
  }

  async getRows(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.ordersService
          .getPastOrders({ page, size: 1000, sort: "id,ASC", q })
          .toPromise();

        if (!res.content) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }
}
