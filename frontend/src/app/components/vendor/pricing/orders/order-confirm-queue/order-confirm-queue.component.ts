import { TemplateRendererComponent } from './../../../../../common/template-renderer/template-renderer.component';
import { OrdersService } from './../../../../../service/orders.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: "app-order-confirm-queue",
  templateUrl: "./order-confirm-queue.component.html",
  styleUrls: ["./order-confirm-queue.component.css"]
})
export class OrderConfirmQueueComponent implements OnInit {
  type = ["search", "filter"];

  searchColumns = [
    {
      name: "Customer Order",
      field: "customerOrder",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Sub-Order",
      field: "subOrder",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Price Accepted",
      field: "priceAccepted",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Customer",
      field: "customer",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Quantity",
      field: "quantity",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Material",
      field: "material",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Process",
      field: "process",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Post-Process",
      field: "postProcess",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Delivery Date",
      field: "deliveryDate",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    }
  ];

  filterColumns = [
    {
      name: "Customer Order",
      field: "customerOrder",
      checked: true,
    },
    {
      name: "Sub-Order",
      field: "subOrder",
      checked: true
    },
    {
      name: "Price Accepted",
      field: "priceAccepted",
      checked: true
    },
    {
      name: "Customer",
      field: "customer",
      checked: true
    },
    {
      name: "Quantity",
      field: "quantity",
      checked: true
    },
    {
      name: "Material",
      field: "material",
      checked: true
    },
    {
      name: "Process",
      field: "process",
      checked: true
    },
    {
      name: "Post-Process",
      field: "postProcess",
      checked: true
    },
    {
      name: "Previously Ordered",
      field: "previouslyOrdered",
      checked: true
    },
    {
      name: "First Shipment",
      field: "firstShipment",
      checked: true
    },
    {
      name: "Delivery Date",
      field: "deliveryDate",
      checked: true
    }
  ];

  selectedIds = [];

  columnDefs: Array<any> = [];
  autoGroupColumnDef = null;
  gridOptions: GridOptions;
  rowData;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private orderService: OrdersService
  ) {
  }

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        this.router.navigateByUrl(`${this.router.url}/${event.data.bidOrder.id}`);
      }
    };
    this.getStartedBidOrders();
  }

  initColumns() {
    this.columnDefs = this.orderService.getOrderViewColumns();
    this.autoGroupColumnDef = {
      headerName: "Vendor Order ID",
    };
  }

  getStartedBidOrders() {
    this.spinner.show();
    this.orderService.getStartedBidOrders().subscribe(v => {
      this.rowData = (v || []).length > 0 ? v : [];
      this.spinner.hide();
    });
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

  filterColumnsChange(event) {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(columns) {
    columns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(
        column.field
      );
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: "", filter: "" });
        }
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setSortModel([
      {
        colId: 'bidOrder.id',
        sort: 'desc'
      }
    ]);
  }

}
