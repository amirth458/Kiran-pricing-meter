import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MachineService } from 'src/app/service/machine.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-vendor-details-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class AdminVendorDetailsMachineComponent implements OnInit {
  @ViewChild('modal') modal;
  columnDefs = [
    {
      headerName: 'Machine No',
      field: 'id',
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: 'Machine Name',
      field: 'name',
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: 'Equipment',
      field: 'equipment.name',
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: 'Material',
      field: 'materialList',
      hide: false,
      sortable: true,
      filter: false,
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
    {
      headerName: 'Serial Number',
      field: 'serialNumber',
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: 'Actions',
      width: 200,
      suppressSizeToFit: true,
      pinned: 'right',
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: param => this.editRow(param),
          delete: async param => {
            this.modalService.open(this.modal, {
              centered: true
            });
            this.selectedMachine = param.data;
          },
          copy: param => {
            this.cloneData = JSON.parse(JSON.stringify(param.data));
            this.copyRow();
          },
          canEdit: true,
          canCopy: true,
          canDelete: true
        }
      }
    }
  ];

  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent
  };
  vendorId = 0;
  status = 0;
  declineComments = '';
  primaryContactName = '';

  selectedMachine = null;
  cloneData = null;

  constructor(
    public route: Router,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    private toastr: ToastrService,
    private machineService: MachineService,
    private modalService: NgbModal
  ) {}

  async ngOnInit() {
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

    const userId = this.route.url.split('/')[3];
    const res = await this.userService.getUserDetails(userId).toPromise();
    this.rowData = res.machines;
    if (res.vendor) {
      this.vendorId = res.vendor.id;
      this.primaryContactName = res.vendor.primaryContactFirstName + ' ' + res.vendor.primaryContactLastName;
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
    this.gridOptions.paginationAutoPageSize = false;
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  async deleteMachine() {
    this.spinner.show();
    try {
      await this.machineService.deleteMachine(this.vendorId, this.selectedMachine.id).toPromise();
      this.toastr.success(this.selectedMachine.name + ' deleted.');
    } catch (e) {
      this.toastr.error('We are sorry, ' + this.selectedMachine.name + ' delete failed. Please try again later.');
      console.log(e);
    } finally {
      this.spinner.hide();
    }
    const filteredData = this.rowData.filter(x => x.id !== this.selectedMachine.id);
    this.rowData = filteredData;
    this.modalService.dismissAll();
  }

  async copyRow() {
    this.machineService.storeCloneData(this.cloneData);
    this.route.navigateByUrl(this.route.url + '/clone');
  }

  addMachine() {
    this.route.navigateByUrl(this.route.url + '/add');
  }
}
