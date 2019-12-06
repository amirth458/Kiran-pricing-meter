import { OrdersService } from './../../../../../service/orders.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { TemplateRendererComponent } from './../../../../../common/template-renderer/template-renderer.component';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-released-orders',
  templateUrl: './released-orders.component.html',
  styleUrls: ['./released-orders.component.css']
})
export class ReleasedOrdersComponent implements OnInit {
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
      name: "Equipment",
      field: "equipment",
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
      name: "NDA",
      field: "nda",
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
      name: "Equipment",
      field: "equipment",
      checked: true
    },
    {
      name: "Post-Process",
      field: "postProcess",
      checked: true
    },
    {
      name: "NDA",
      field: "nda",
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
    private orderService: OrdersService,
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
        // this.onRowClick(event);
        //console.log('row click', event.data.id);
        this.router.navigateByUrl(this.router.url + "/" + event.data.id);
      }
    };
    this.getOrderConfirmationQueue();
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: "Vendor Order ID",
        field: "vendorOrderId",
        hide: true,
        sortable: true,
        filter: false,
        rowGroup: true,
      },
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
        filter: false,
      },
      {
        headerName: "Price Accepted",
        field: "priceAccepted",
        hide: false,
        sortable: true,
        filter: false,
      },
      {
        headerName: "Customer",
        field: "customer",
        hide: false,
        sortable: true,
        filter: false,
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
        headerName: "Equipment",
        field: "equipment",
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
        headerName: "NDA",
        field: "nda",
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
      {
        headerName: "Status",
        field: "status",
        hide: false,
        sortable: true,
        filter: false
      }
    ];
    this.autoGroupColumnDef = {
      headerName: "Vendor Order ID",
    };
  }

  async getOrderConfirmationQueue(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.orderService
          .getReleasedOrders({ page, size: 1000, sort: "id,ASC", q })
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
  }

}
