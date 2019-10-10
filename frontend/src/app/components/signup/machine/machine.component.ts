import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { MaterialService } from 'src/app/service/material.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquipmentService } from 'src/app/service/equipment.service';
import { FacilityService } from 'src/app/service/facility.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class RegisterMachineComponent implements OnInit, AfterViewChecked {
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
        data.materialList.map((x, index) => {
          if (index === 0) {
            materials = x.name;
          } else {
            materials = materials + ',' + x.name;
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
    this.spinner.show();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
    };

    const data = this.userService.getRegisterMachineInfo();
    if (data) {
      this.rowData = data;
    }
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
    this.materials = initValue.materialList || [];
    this.equipments = [ initValue.equipment ];
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

  deleteMachine() {
    const filteredData = this.rowData.filter(x => x.id !== this.selectedMachine.id);
    this.rowData = filteredData;
    this.modal.nativeElement.click();
    this.userService.setRegisterMachineInfo(this.rowData);
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

  prepareData() {
    const arr = $('#materialInput .ng-value-label').map(function() {
      return $(this).html();
    }).get();
    const postData = {
      id: this.form.value.id,
      name: this.form.value.name,
      serialNumber: this.form.value.serialNumber,
      equipment: { id: this.form.value.equipment, name: $('#equipmentInput .ng-value-label').html()},
      materialList: [...this.form.value.material.map((materialId, index) => {
        return { id: materialId, name: arr[index]};
      })]
    };
    return postData;
  }

  async add(event) {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    this.duplicated = 0;
    this.error = '';
    const postData = this.prepareData();
    if (this.isUpdate ) {
      this.rowData = this.rowData.map((item) => {
        if ( item.id === postData.id) {
          return {...postData};
        } else {
          return {...item};
        }
      });
    } else {
      this.rowData = this.rowData.map((item, index) => {
        return {id: index + 1, ...item};
      });
      postData.id = this.rowData.length + 1;
      this.rowData = [...this.rowData, postData];
    }
    this.userService.setRegisterMachineInfo(this.rowData);
    this.isUpdate = false;
    this.form.reset();
  }

  async submitUserRegisterInfo(event) {
    this.spinner.show();
    try {
      const userInfo = this.userService.getRegisterUserInfo();
      const vendorInfo = this.userService.getRegisterVendorInfo();
      const reqData = {
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        companyName: userInfo.company,
        department: userInfo.department,
        phoneNo: userInfo.phone,
        vendor: {
          name: vendorInfo.name,
          vendorType: {
              id: vendorInfo.vendorType.id
          },
          email: vendorInfo.email,
          phone: vendorInfo.phone,
          street1: vendorInfo.street1,
          street2: vendorInfo.street2,
          city: vendorInfo.city,
          state: vendorInfo.state,
          country: {
            id: vendorInfo.country.id
          },
          zipCode: vendorInfo.zipCode,
          confidentiality: {
            id: vendorInfo.confidentiality.id
          },
          vendorIndustries: [
            {
              id: vendorInfo.vendorIndustries[0].id
            }
          ],
          vendorCertificates: vendorInfo.vendorCertificates.map(cert => {
            return {id: cert.id};
          }) || [],
          primaryContactFirstName: vendorInfo.primaryContactFirstName,
          primaryContactLastName: vendorInfo.primaryContactLastName
        },
        machines: this.rowData.map(machine => {
          return {
            name: machine.name,
            serialNumber: machine.serialNumber,
            equipment: {
              id: machine.equipment.id
            },
            materialList: machine.materialList.map(mat => {
              return {id: mat.id};
            }) || []
          };
        }) || []
      };
      const res = await this.userService.registerUser(reqData).toPromise();
      this.toastr.success('User registered Successfully');

      setTimeout(() => {
        this.userService.resetRegisterInfo();
        this.route.navigateByUrl('/siginup-completed');
      }, 2000);

    } catch (e) {
      console.log(e);
      this.toastr.error('We are sorry, Corporate details update failed. Please try again later. "' + e.error.message + '"');
    } finally {
      this.spinner.hide();
    }
  }
}
