import { Component, OnInit, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { CarrierCellRendererComponent } from 'src/app/common/carrier-cell-renderer/carrier-cell-renderer.component';

import { ShippingService } from '../../service/shipping.service';
import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

  @ViewChild('modal') modal;
  selectedShipping = null;

  searchColumns = [
    // {
    //   name: 'Carrier No', checked: false, field: 'id', query: {
    //     type: '',
    //     filter: '',
    //   }
    // },
    {
      name: 'Carrier', checked: false,
      field: 'carrier', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Account ID', checked: false,
      field: 'accountId', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Status', checked: false,
      field: 'status', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Actions', checked: false,
      field: 'actions', query: {
        type: '',
        filter: '',
      }
    },
  ];
  filterColumns = [
    // {
    //   name: 'Carrier No', checked: true, field: 'id'
    // },
    {
      name: 'Carrier', checked: true, field: 'carrier'
    },
    {
      name: 'Account ID', checked: true, field: 'accountId'
    },
    {
      name: 'Status', checked: true, field: 'status'
    },
    {
      name: 'Actions', checked: true, field: 'actions'
    },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
    carrierCellRenderer: CarrierCellRendererComponent
  };

  columnDefs = [
    // { headerName: 'Carrier No', field: 'id', hide: false, sortable: true, filter: true },
    {
      headerName: 'Carrier', field: 'carrier', hide: false, sortable: true, filter: false,
      cellRenderer(params)  {
        let str = '';
        switch (params.data.shippingProvider.id) {
          case 1:
            str = '<img src="assets/image/shipping/usps.png" class="shipping-icon" />';
            break;
          case 2:
            str = '<img src="assets/image/shipping/dhl.png" class="shipping-icon" />';
            break;
          case 3:
            str = '<img src="assets/image/shipping/fastaust.png" class="shipping-icon" />';
            break;
          case 4:
            str = '<img src="assets/image/shipping/couriers.png" class="shipping-icon" />';
            break;
          case 5:
            str = '<img src="assets/image/shipping/sendle.png" class="shipping-icon" />';
            break;
          case 6:
            str = '<img src="assets/image/shipping/deutsche.png" class="shipping-icon" />';
            break;
          case 7:
            str = '<img src="assets/image/shipping/fedex.png" class="shipping-icon-fedex" />';
            break;
          case 8:
            str = '<img src="assets/image/shipping/ups.png" class="shipping-icon" />';
            break;
          default:
            str = '';
            break;
        }
        return str + params.data.shippingProvider.name;
      }
    },
    { headerName: 'Account ID', field: 'accountId', hide: false, sortable: true, filter: false },
    { headerName: 'Status', field: 'status', hide: false, sortable: true, filter: false },
    {
      headerName: 'Actions',
      width: 50,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          delete: async (param) => {
            this.modal.nativeElement.click();
            this.selectedShipping = param.data;
          },
          canEdit: true,
          canCopy: false,
          canDelete: true,
        }
      }
    }
  ];


  gridOptions: GridOptions;

  rowData;
  pageSize = 10;
  constructor(
    public route: Router,
    public shippingService: ShippingService,
    public userService: UserService,
    public spineer: NgxSpinnerService

  ) {

  }

  ngOnInit() {
    this.getVendorShippings();
    if (this.type.includes('filter')) {
      this.configureColumnDefs();
    }
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: (event) => {
        // this.onRowClick(event);
      }

    };
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();

    }, 50);
  }
  async getVendorShippings() {
    this.spineer.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.shippingService.getShippings(
          this.userService.getVendorInfo().id,
          { page, size: 1000, sort: 'id,ASC', q: '' }
        ).toPromise();

        rows.push(...res.content);

        if (!res.content) { break; }
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }

        page++;
      }
      this.rowData = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
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

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  async deleteShipping() {
    this.spineer.show();
    try {
      await this.shippingService.deleteShipping(this.userService.getVendorInfo().id, this.selectedShipping.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedShipping.id);
    this.rowData = filteredData;
    this.modal.nativeElement.click();

  }

  searchColumnsChange(event) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (column.checked) {
        columnInstance.setModel(column.query);
      } else {
        columnInstance.setModel({ type: '', filter: '' });
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
}



