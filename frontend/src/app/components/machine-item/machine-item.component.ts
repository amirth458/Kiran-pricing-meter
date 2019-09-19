import { Component, OnInit, AfterViewChecked } from '@angular/core';
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

@Component({
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [];
  materials = [];
  selectedMaterials = [];
  selectedEquipment;
  machine;

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null, Validators.required],
    name: [null],
    serialNumber: [null],
    equipment: [null, Validators.required],
    material: [null, Validators.required],
    facility: [null, Validators.required]
  });
  machineId = null;
  constructor(
    public route: Router,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
    public facilityService: FacilityService,
    public userService: UserService) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.getMaterials();
      await this.getEquipments();
      await this.getFacilities();

      // console.log(this.materials);
      // console.log(this.equipments);
      // console.log(this.facilities);

      if (this.route.url.includes('edit')) {
        this.machineId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];

        this.machine = await this.machineService.getMachine(this.userService.getUserInfo().id, this.machineId).toPromise();
        console.log(this.machine);

        this.initForm(this.machine);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    }

  }

  async getMachine(machineId) {
  }

  async getMaterials() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q: 'ab' };
        const res = await this.materialService.getMaterials(param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        if (page > 1) {
          break;
        }
        page++;
      }
      this.materials = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
    // return await this.materialService.getMaterials({ page: 0, size: 1000, sort: 'id,ASC' }, 'a').toPromise();
  }

  async getEquipments() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q: '' };
        const res = await this.equipmentService.getEquipments(param, 'ab').toPromise();
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
        const res = await this.facilityService.getFacilities(this.userService.getUserInfo().id, param).toPromise();
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
    console.log(initValue);
    this.selectedMaterials = initValue.vendorEquipmentMaterialList.map(x => x.material.id) || [];
    this.selectedEquipment = initValue.equipment.id || '';
    console.log(this.selectedEquipment, this.selectedMaterials);
    this.form.setValue({
      id: initValue.id,
      name: initValue.name,
      vendorId: initValue.vendorId,
      serialNumber: initValue.serialNumber,
      equipment: initValue.equipment.name,
      material: '',
      facility: ''
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
          this.save();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }
  save() {
    console.log(this.form);
    console.log(this.selectedMaterials);
    console.log(this.selectedEquipment);
  }
}
