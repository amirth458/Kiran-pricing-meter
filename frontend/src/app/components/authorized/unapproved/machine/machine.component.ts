import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MachineService } from 'src/app/service/machine.service';
import { MaterialService } from 'src/app/service/material.service';
import { EquipmentService } from 'src/app/service/equipment.service';
import { FacilityService } from 'src/app/service/facility.service';
import { FilterOption } from 'src/app/model/vendor.model';

@Component({
  selector: 'app-unapproved-vendor-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class UnapprovedVendorMachineComponent implements OnInit {
  @ViewChild('modal') modal;

  selectedMachine = null;
  equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  materials = [{ id: '', name: 'more than 2 characters to start search' }];
  allEquipments = [];
  allMaterials = [];
  selectedMaterials = [];
  selectedEquipment = 0;
  isMaterialLoading = false;
  isEquipmentLoading = false;
  isUpdate = false;
  error = '';

  @ViewChild('materialInput') materialInput;
  @ViewChild('equipmentInput') equipmentInput;
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
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          delete: async (param) => {
            this.modal.nativeElement.click();
            this.selectedMachine = param.data;
          },
          canEdit: true,
          canCopy: false,
          canDelete: true,
        }
      }
    }
  ];

  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  machineId = 0;

  form: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    serialNumber: [null, Validators.required],
    equipment: [null, Validators.required],
    material: [null, Validators.required],
  });

  duplicated = 0;
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
    public facilityService: FacilityService,
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
    this.getMachinery();

    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 50);
  }

  showRequired(field: string, fieldType: number): boolean {
    if (fieldType === 1) {
      return this.form.value[field] === '' || this.form.value[field] === null;
    } else if (fieldType === 2) {
      return Number(this.form.value[field]) === 0;
    } else if (fieldType === 3) {
      return this.form.value[field] === null || this.form.value[field].length === 0;
    }
  }
  async getMachinery() {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'id,ASC', page, q: '' };
        const res = await this.machineService.getMachinery(this.userService.getVendorInfo().id, param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        page++;
        rows.push(...res.content);
      }
      this.rowData = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  async getMaterials(q) {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q };
        const res = await this.materialService.getMaterials(param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.materials = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  async getEquipments(q) {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q };
        const res = await this.equipmentService.getEquipments(param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.equipments = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  initForm(initValue) {
    this.materials = initValue.machineServingMaterialList.map(mat => {
      return mat.material;
    }) || [];
    this.equipments = [ initValue.equipment ];
    this.machineId = initValue.id;
    this.form.setValue({
      id: initValue.id,
      name: initValue.name,
      serialNumber: initValue.serialNumber,
      equipment: initValue.equipment.id,
      material: this.materials.map(mat => mat.id) || []
     });
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  editRow(event) {
    this.isUpdate = true;
    this.initForm(event.data);
  }

  async deleteMachine() {
    this.spinner.show();
    try {
      await this.machineService.deleteMachine(this.userService.getVendorInfo().id, this.selectedMachine.id).toPromise();
      this.toastr.success(this.selectedMachine.name + ' deleted.');
    } catch (e) {
      this.toastr.error('We are sorry, ' + this.selectedMachine.name + ' delete failed. Please try again later.');
      console.log(e);
    } finally {
      this.spinner.hide();
    }
    const filteredData = this.rowData.filter(x => x.id !== this.selectedMachine.id);
    this.rowData = filteredData;
    this.modal.nativeElement.click();
    this.isUpdate = false;
  }

  clearStore() {
    this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
    this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  }

  async onMaterialSearch(event) {
    if (event.keyCode === 13) {
      this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
      // this.materials = [];
    }
    if (event.target.value.length >= 2) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        return;
      }
      this.isMaterialLoading = true;
      await this.getMaterials(event.target.value);
      this.isMaterialLoading = false;
    } else {
      this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
    }
  }

  async onEquipmentSearch(event) {
    if (event.keyCode === 13) {
      this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
      // this.equipments = [];
    }

    if (event.target.value.length >= 2) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        return;
      }
      this.isEquipmentLoading = true;
      await this.getEquipments(event.target.value);
      this.isEquipmentLoading = false;
    } else {
      this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
    }
  }
  prepareDataServer() {
    const postData = {
      id: this.form.value.id,
      vendorId: this.userService.getVendorInfo().id,
      name: this.form.value.name,
      serialNumber: this.form.value.serialNumber,
      equipment: { id: this.form.value.equipment },
      // materialList: this.form.value.material ? [...this.form.value.material.map((materialId) => {
      //   return { id: materialId };
      // })] : [],
      materialList: [...this.form.value.material.map((materialId) => {
        return { id: materialId };
      })],
      vendorFacility: { id: this.form.value.vendorFacility },
      updatedDate: '',
      createdBy: '',
      createdDate: '',
    };

    postData.updatedDate = new Date().toString();
    if (!this.isUpdate) {
      postData.createdBy = String(this.userService.getVendorInfo().id);
      postData.createdDate = new Date().toString();
    } else {
      postData.updatedDate = new Date().toString();
    }
    return postData;
  }

  async add(event) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }

    this.error = '';
    const postData = this.prepareDataServer();
    const vendorId = this.userService.getVendorInfo().id;
    if (!this.isUpdate) {
      this.spinner.show();
      try {
        await this.machineService.createMachine(vendorId, postData).toPromise();
        this.form.reset();
        this.isUpdate = false;
        await this.getMachinery();
      } catch (e) {
        this.toastr.error('We are sorry, ' +  postData.name + ' creation failed. Please try again later.');
        this.error = e.error.message;
        console.log(e);
      } finally {
        this.spinner.hide();
      }

    } else {
      this.spinner.show();
      try {
        await this.machineService.updateMachine(vendorId, this.machineId, postData).toPromise();
        this.form.reset();
        this.isUpdate = false;
        await this.getMachinery();
      } catch (e) {
        this.toastr.error('We are sorry, ' +  postData.name + ' update failed. Please try again later.');
        this.error = e.error.message;
        console.log(e);
      } finally {
        this.spinner.hide();
      }
    }


  }

  onSaveMachineInformation(event) {

  }
}
