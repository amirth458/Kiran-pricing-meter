import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-vendor-details-machine',
  templateUrl: './vendor-details-machine.component.html',
  styleUrls: ['./vendor-details-machine.component.css']
})
export class AdminVendorDetailsMachineComponent implements OnInit {

  columnDefs = [
    { headerName: 'Machine No', field: 'id', hide: false, sortable: true, filter: false },
    { headerName: 'Machine Name', field: 'name', hide: false, sortable: true, filter: false },
    {
      headerName: 'Equipment', field: 'equipment.name', hide: false, sortable: true, filter: false
    },
    {
      headerName: 'Material', field: 'materialList', hide: false, sortable: true, filter: false,
      cellRenderer(params) {
        const data = params.data;
        let materials = '';
        data.machineServingMaterialList.map((x, index) => {
          if (index === 0) {
            materials = x.material.name;
          } else {
            materials = materials + ',' + x.material.name;
          }
        });
        return `${materials}`;
      }
    },
    { headerName: 'Serial Number', field: 'serialNumber', hide: false, sortable: true, filter: false },
  ];

  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };
  vendorId = 0;
  status = 0;

  constructor(
    public route: Router,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
    };

    const userId = this.route.url.split('/')[3];
    const res = await this.userService.getUserDetails(userId).toPromise();
    this.rowData = res.machines;
    if (res.vendor) {
      this.vendorId = res.vendor.id;
      if (res.vendor.approved) {
        this.status = 1; // approved
      } else {
        if (res.vendor.approvedAt !== null) {
          this.status = 2; // declined
        } else {
          this.status = 3; // non-approved
        }
      }
    } else {
      this.status = 0; // can't approve, decline
    }
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 50);
  }

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  async approveUser() {
    this.spinner.show();
    try {
      await this.userService.approveUser(this.vendorId).toPromise();
      this.route.navigateByUrl('/admin/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not approved. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }

  async declineUser() {
    this.spinner.show();
    try {
      await this.userService.declineUser(this.vendorId).toPromise();
      this.route.navigateByUrl('/admin/approve');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not declined. Please try again later.');
    } finally {
      this.spinner.hide();
    }
  }
}
