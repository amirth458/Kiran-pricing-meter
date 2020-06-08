import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';

import { VendorService } from 'src/app/service/vendor.service';
import { UserService } from 'src/app/service/user.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { EquipmentService } from 'src/app/service/equipment.service';
import { FacilityService } from 'src/app/service/facility.service';
import { MaterialService } from 'src/app/service/material.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-vendor-machine',
  templateUrl: './add-vendor-machine.component.html',
  styleUrls: ['./add-vendor-machine.component.css']
})
export class AddVendorMachineComponent implements OnInit {
  @ViewChild('machineModal') machineModal: TemplateRef<any>;

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
  agreementUrl = environment.agreementUrl;

  @ViewChild('materialInput') materialInput;
  @ViewChild('equipmentInput') equipmentInput;
  columnDefs: ColDef[] = [
    {
      headerName: 'Machine No',
      field: 'id',
      hide: false,
      sortable: true,
      filter: false,
      sort: 'desc'
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
    {
      headerName: 'Serial Number',
      field: 'serialNumber',
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: param => this.editRow(param),
          delete: async param => {
            this.modalService.open(this.machineModal, {
              centered: true
            });
            this.selectedMachine = param.data;
          },
          canEdit: true,
          canCopy: false,
          canDelete: true
        }
      }
    }
  ];

  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  loadingPanel = false;

  form: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    serialNumber: [null, Validators.required],
    equipment: [null, Validators.required],
    material: [null, Validators.required]
  });

  duplicated = 0;
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent
  };

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
    public facilityService: FacilityService,
    public userService: UserService,
    public vendorService: VendorService,
    private toaster: ToastrService,
    private modalService: NgbModal
  ) {}

  async ngOnInit() {
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
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
    this.spinner.show();
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
      this.spinner.hide();

      this.materials = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  async getEquipments(q) {
    let page = 0;
    const rows = [];
    this.spinner.show();
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
      this.spinner.hide();
      this.equipments = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  initForm(initValue) {
    this.materials = initValue.materialList || [];
    this.equipments = [initValue.equipment];
    this.form.setValue({
      id: initValue.id,
      name: initValue.name,
      serialNumber: initValue.serialNumber,
      equipment: initValue.equipment.id,
      material: this.materials.map(mat => mat.id) || []
    });
  }

  ngOnDestroy() {
    this.userService.setRegisterMachineInfo(this.rowData);
    if (this.form.valid) {
      this.userService.setVendorRegistrationFormValidity('machine', true);
    } else {
      this.userService.setVendorRegistrationFormValidity('machine', false);
    }
  }

  ngAfterViewChecked(): void {}

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
    this.modalService.dismissAll();
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
      if (
        event.keyCode === 13 ||
        event.keyCode === 37 ||
        event.keyCode === 38 ||
        event.keyCode === 39 ||
        event.keyCode === 40
      ) {
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
      if (
        event.keyCode === 13 ||
        event.keyCode === 37 ||
        event.keyCode === 38 ||
        event.keyCode === 39 ||
        event.keyCode === 40
      ) {
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
    const postData = {
      id: this.form.value.id,
      name: this.form.value.name,
      serialNumber: this.form.value.serialNumber,
      equipment: {
        id: this.form.value.equipment,
        name: this.equipments.find(item => item.id === this.form.value.equipment).name
      },
      materialList: [
        ...this.form.value.material.map((materialId, index) => {
          return { id: materialId, name: this.materials.find(item => item.id === materialId).name };
        })
      ]
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
    if (this.isUpdate) {
      this.rowData = this.rowData.map(item => {
        if (item.id === postData.id) {
          return { ...postData };
        } else {
          return { ...item };
        }
      });
    } else {
      this.rowData = this.rowData.map((item, index) => {
        return { id: index + 1, ...item };
      });
      postData.id = this.rowData.length + 1;
      this.rowData = [...this.rowData, postData];
    }
    this.userService.setRegisterMachineInfo(this.rowData);
    this.isUpdate = false;
    this.form.reset();
  }

  submitUserRegisterInfo() {
    this.spinner.show('spooler');
    this.loadingPanel = true;
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
        vendorCertificates:
          vendorInfo.vendorCertificates.map(cert => {
            return { id: cert.id };
          }) || [],
        primaryContactFirstName: vendorInfo.primaryContactFirstName,
        primaryContactLastName: vendorInfo.primaryContactLastName
      },
      machines:
        this.rowData.map(machine => {
          return {
            name: machine.name,
            serialNumber: machine.serialNumber,
            equipment: {
              id: machine.equipment.id
            },
            materialList:
              machine.materialList.map(mat => {
                return { id: mat.id };
              }) || []
          };
        }) || []
    };
    this.userService.setVendorRegistrationFormValidity('machine', true);
    this.userService
      .registerVendor(reqData)
      .pipe(
        catchError((err: any) => {
          this.toaster.error(
            `Registration failed: ${err.error.message ||
              'Email address is not available. Please try again with new email address'}`
          );
          this.loadingPanel = false;
          this.spinner.hide('spooler');
          this.userService.setVendorRegistrationFormValidity('machine', false);
          return empty();
        })
      )
      .subscribe(() => {
        this.loadingPanel = false;
        this.spinner.hide('spooler');
        this.userService.setRegisterUserInfo(null);
        this.userService.setRegisterVendorInfo(null);
        this.userService.setRegisterMachineInfo(null);
        this.toaster.success('User registered Successfully');
        this.userService.resetRegisterInfo();
        this.route.navigateByUrl('/user-manage/approve-vendor');
      });
  }

  canSubmit() {
    const validity = this.userService.getVendorRegistrationFormValidity();
    return !((this.rowData || []).length > 0) && validity.user && validity.machine && validity.vendor;
  }
}
