import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Machine } from 'src/app/model/machine.model';

import * as machines from '../../../assets/static/machines';
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
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  materials = [{ id: '', name: 'more than 2 characters to start search' }];
  selectedMaterials = [];
  selectedEquipment;
  machine;
  isNew = true;
  isMaterialLoading = false;
  isEquipmentLoading = false;

  error = '';

  @ViewChild('materialInput') materialInput;
  @ViewChild('equipmentInput') equipmentInput;

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    name: [null, Validators.required],
    serialNumber: [null, Validators.required],
    equipment: [null, Validators.required],
    material: [null, Validators.required],
    // material: [null],
    vendorFacility: ['', Validators.required]
  });
  machineId = null;
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
    try {
      await this.getFacilities();
      if (this.route.url.includes('edit')) {
        this.isNew = false;
        this.machineId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        this.machine = await this.machineService.getMachine(this.userService.getVendorInfo().id, this.machineId).toPromise();
        this.materials = this.machine.machineServingMaterialList.map(x => x.material);
        this.equipments = [this.machine.equipment];
        this.initForm(this.machine);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    }

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
        page++;
      }
      this.equipments = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  async getFacilities() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q: '' };
        const res = await this.facilityService.getFacilities(this.userService.getVendorInfo().id, param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      this.facilities = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  initForm(initValue: Machine) {
    this.selectedMaterials = initValue.machineServingMaterialList.map(x => x.material.id) || [];
    this.selectedEquipment = initValue.equipment.id;
    this.form.setValue({
      id: initValue.id,
      name: initValue.name,
      vendorId: initValue.vendorId,
      serialNumber: initValue.serialNumber,
      equipment: this.selectedEquipment,
      material: this.selectedMaterials,
      vendorFacility: initValue.vendorFacility.id
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

  clearStore() {
    this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
    this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
    // this.materials = [];
    // this.equipments = [];
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
    if (this.isNew) {
      postData.createdBy = String(this.userService.getVendorInfo().id);
      postData.createdDate = new Date().toString();
    } else {
      postData.updatedDate = new Date().toString();
    }
    return postData;
  }

  async save(event) {
    event.preventDefault();
    if (this.form.valid) {
      this.error = '';
      const postData = this.prepareData();
      const vendorId = this.userService.getVendorInfo().id;
      if (this.isNew) {
        this.spinner.show();
        try {
          await this.machineService.createMachine(vendorId, postData).toPromise();
          const gotoURL = `/profile/vendor/machines`;
          this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: '"' + postData.name + '" is created.' } } });
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
          const gotoURL = `/profile/vendor/machines`;
          this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: '"' + postData.name + '" is updated.' } } });
        } catch (e) {
          this.toastr.error('We are sorry, ' +  postData.name + ' update failed. Please try again later.');
          this.error = e.error.message;
          console.log(e);
        } finally {
          this.spinner.hide();
        }

      }
    }

  }
}
