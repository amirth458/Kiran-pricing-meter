import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Machine } from 'src/app/model/machine.model';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { MaterialService } from 'src/app/service/material.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquipmentService } from 'src/app/service/equipment.service';
import { FacilityService } from 'src/app/service/facility.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatureTypeIdEnum } from 'src/app/model/subscription.model';

@Component({
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit, AfterViewChecked {
  constructor(
    public route: Router,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
    public facilityService: FacilityService,
    public userService: UserService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  featureTypesEnum = FeatureTypeIdEnum;
  facilities = [];
  equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  materials = [{ id: '', name: 'more than 2 characters to start search' }];
  selectedMaterials = [];
  selectedEquipment;
  machine;
  vendorId = null;
  userId = null;
  isNew = true;
  isMaterialLoading = false;
  isEquipmentLoading = false;
  equipmentList = [];
  error = '';
  units = [];
  defaultUnits = [];
  selectedUnits = [];
  featureTypes = [];
  featureShow = false;
  allowedFeatureList = ['Injection Molding', '3D Printing', 'CNC Machining', 'Casting'];
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
  measureTypeId = '';

  // TODO:
  // To be removed along with 'Base 2' in due time
  mmUnit = null;

  async ngOnInit() {
    this.spinner.show();
    try {
      const routeParams = this.route.url.split('/');
      this.userId = routeParams[3];
      const vendorUserDetails = await this.userService.getUserDetails(this.userId).toPromise();
      this.vendorId = vendorUserDetails.vendor.id;

      await this.getFacilities();
      const response = await this.machineService.getUnits().toPromise();
      this.units = response.metadataList;
      this.units.map(item => {
        if (item.isDefault) {
          this.defaultUnits.push(item);
        }
        if (item.name == 'millimeters') {
          this.mmUnit = item;
        }
      });

      if (this.route.url.includes('edit')) {
        this.isNew = false;
        this.machineId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        this.machine = await this.machineService.getMachine(this.vendorId, this.machineId).toPromise();
        this.materials = this.machine.machineServingMaterialList.map(x => x.material);
        this.equipments = [this.machine.equipment];
        const equipment: any = this.equipments[0];
        const processTypeId = equipment.processFamily.processType.id;
        this.featureTypes = await this.machineService.getEquipmentFeatureType(processTypeId).toPromise();
        if (this.featureTypes.length > 0) {
          this.featureShow = true;
          this.equipmentList = this.machine.vendorMachineryEquipmentFeatureList;
          this.equipmentList.map((item, index) => {
            this.equipmentList[index].unitList = this.getFeatureUnits(this.equipmentList[index].equipmentFeatureType);
          });
        } else {
          this.featureShow = false;
          this.equipmentList = [];
        }
        this.initForm(this.machine);
      }

      if (this.route.url.includes('clone')) {
        this.isNew = true;
        this.machine = this.machineService.getCloneData();
        // processProfile.id = 0;
        // this.machineId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];

        this.materials = this.machine.machineServingMaterialList.map(x => x.material);
        this.equipments = [this.machine.equipment];
        const equipment: any = this.equipments[0];
        const processTypeId = equipment.processFamily.processType.id;
        this.featureTypes = await this.machineService.getEquipmentFeatureType(processTypeId).toPromise();

        if (this.featureTypes.length > 0) {
          this.featureShow = true;
          this.equipmentList = this.machine.vendorMachineryEquipmentFeatureList;

          this.equipmentList.map((item, index) => {
            this.equipmentList[index].unitList = this.getFeatureUnits(this.equipmentList[index].equipmentFeatureType);
          });
        } else {
          this.featureShow = false;
          this.equipmentList = [];
        }
        setTimeout(() => {
          this.initForm(this.machine);
        }, 100);
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
      this.materials = rows.map(item => ({
        ...item,
        name: this.htmlDecode(item.name)
      }));
      console.log(this.materials);
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  htmlDecode(input) {
    const str = input;
    return str.replace(/&/g, ' and ').replace(/&amp;/g, ' and ');
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
    this.facilities = await this.facilityService.getFacilities(this.vendorId).toPromise();
  }

  initForm(initValue: Machine) {
    const materials = initValue.machineServingMaterialList.map(x => x.material) || [];
    materials.map((m: any) => {
      m.Material = m.name;
    });
    this.selectedMaterials = materials;
    const eq: any = initValue.equipment || {};
    eq.Equipment = eq.name || '';
    this.selectedEquipment = initValue.equipment;
    this.form.setValue({
      id: initValue.id,
      name: initValue.name,
      vendorId: initValue.vendorId,
      serialNumber: initValue.serialNumber,
      equipment: this.selectedEquipment.id,
      material: this.selectedMaterials.map(item => item.id),
      vendorFacility: initValue.vendorFacility ? initValue.vendorFacility.id : ''
    });
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, form => {
      form.addEventListener(
        'submit',
        event => {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          } else {
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }

  async clearStoreEquipment() {
    this.equipments.map(item => {
      if (item.id == this.form.value.equipment) {
        this.selectedEquipment = item;
      }
    });

    const equipment = this.selectedEquipment;

    if (equipment && equipment.id) {
      // if (equipment && equipment['Process Family'] && equipment['Process Type']) {
      // const param: FilterOption = {
      //   size: 1,
      //   q: equipment.name,
      //   sort: 'id,DESC',
      //   page: 0
      // };
      // const equipmentData = await this.equipmentService
      //   .getEquipments(param)
      //   .toPromise();
      const processTypeId = equipment.processFamily.processType.id;

      this.featureTypes = await this.machineService.getEquipmentFeatureType(processTypeId).toPromise();

      console.log('Feature Types ', this.featureTypes);

      if (this.featureTypes.length > 0) {
        this.featureShow = true;
        this.equipmentList = [];
        this.addAllFeatureTypes(equipment);
      } else {
        this.featureShow = false;
        this.equipmentList = [];
      }
    } else {
      this.featureShow = false;
      this.equipmentList = [];
    }
    this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  }

  clearStore() {
    this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
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
      vendorId: this.vendorId,
      name: this.form.value.name,
      serialNumber: this.form.value.serialNumber,
      equipment: { id: this.form.value.equipment },
      materialList: [
        ...this.form.value.material.map(materialId => {
          return { id: materialId };
        })
      ],
      vendorFacility: { id: this.form.value.vendorFacility },
      updatedDate: '',
      createdBy: '',
      createdDate: '',
      vendorMachineryEquipmentFeatureList: this.equipmentList
    };
    postData.updatedDate = new Date().toString();
    if (this.isNew) {
      postData.createdBy = String(this.vendorId);
      postData.createdDate = new Date().toString();
    } else {
      postData.updatedDate = new Date().toString();
    }
    return postData;
  }

  addEquipment(event) {
    this.equipmentList.push({
      id: '',
      equipmentFeatureType: {
        id: '',
        measurementType: {
          id: ''
        }
      },
      unitType: {
        id: ''
      },
      unitList: [],
      value: ''
    });
  }

  addAllFeatureTypes(equipment) {
    this.featureTypes.map(featureType => {
      const equip = {
        id: '',
        equipmentFeatureType: {
          id: featureType.id,
          measurementType: {
            id: ''
          }
        },
        unitType: {
          id: ''
        },
        unitList: [],
        value: ''
      };
      if ((featureType.name || '').toLowerCase() === 'buildable x') {
        equip.value = equipment.x || '';
      } else if ((featureType.name || '').toLowerCase() === 'buildable y') {
        equip.value = equipment.y || '';
      } else if ((featureType.name || '').toLowerCase() === 'buildable z') {
        equip.value = equipment.z || '';
      } else if ((featureType.name || '').toLowerCase() === 'min wall thickness') {
        equip.value = equipment.minWallThickness || '';
      }
      this.equipmentList.push(equip);
      const featureTypeListIndex = this.equipmentList.length - 1;
      this.onChangeFeatureType(featureType.id, featureTypeListIndex);
    });
  }

  onChangeFeatureType(event, index) {
    // const featureType = $(event.target).val();
    const featureType = event;
    if (featureType === '') {
      this.equipmentList[index].equipmentFeatureType.measurementType.id = '';
      this.equipmentList[index].unitList = [];
    } else {
      const feature = this.featureTypes.find(item => item.id === Number(featureType));
      this.equipmentList[index].equipmentFeatureType.measurementType.id = feature.measurementType.id;
      this.equipmentList[index].unitList = this.getFeatureUnits(this.equipmentList[index].equipmentFeatureType);
      const defaultValue = this.defaultUnits.filter(item => item.measurementType.id == feature.measurementType.id);

      // TODO: Base 2
      // Remove this when the db corrects to default to mm for machine screen
      // hardcoding mm unit as default for now
      // Remove this when the db corrects to default to mm for machine screen'

      if (defaultValue.length) {
        if (defaultValue[0].name == 'centimeters') {
          this.equipmentList[index].unitType.id = this.mmUnit.id;
        } else {
          this.equipmentList[index].unitType.id = defaultValue[0].id;
        }
      } else {
        this.equipmentList[index].unitType.id = '';
      }
    }
  }

  getFeatureUnits(equipmentFeatureType) {
    const measurementTypeId = equipmentFeatureType.measurementType.id;
    return this.units.filter(item => item.measurementType.id === measurementTypeId);
  }

  removeFeature(index) {
    const frontSlice = this.equipmentList.slice(0, index);
    const endSlice = this.equipmentList.slice(index + 1);
    this.equipmentList = frontSlice.concat(endSlice);
  }

  async save(event) {
    event.preventDefault();
    console.log(this.form);
    if (this.form.valid) {
      if (this.equipmentList.length > 0) {
        const errors = this.equipmentList.map(equip => {
          return equip.equipmentFeatureType.id !== '' && equip.unitType.id !== '' && equip.value !== '';
        });
        if (errors.filter(error => error === false).length > 0) {
          return;
        }
      }
      this.error = '';
      const postData = this.prepareData();
      const vendorId = this.vendorId;
      if (this.isNew) {
        this.spinner.show();
        try {
          await this.machineService.createMachine(vendorId, postData).toPromise();
          const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/'));
          this.route.navigateByUrl(gotoURL, {
            state: {
              toast: {
                type: 'success',
                body: '"' + postData.name + '" created.'
              }
            }
          });
        } catch (e) {
          this.toastr.error('We are sorry, ' + postData.name + ' creation failed. Please try again later.');
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
          this.route.navigateByUrl(gotoURL, {
            state: {
              toast: {
                type: 'success',
                body: '"' + postData.name + '" updated.'
              }
            }
          });
        } catch (e) {
          this.toastr.error('We are sorry, ' + postData.name + ' update failed. Please try again later.');
          this.error = e.error.message;
          console.log(e);
        } finally {
          this.spinner.hide();
        }
      }
    }
  }

  removeMaterialItem(index) {
    const arr: any = (this.selectedMaterials || []).splice(index, 1);
    if ((arr || []).length > 0) {
      const item: any = arr[0];
      const idx = (this.form.value.material || []).indexOf(item.id);
      if (idx > -1) {
        (this.form.value.material || []).splice(idx, 1);
      }
    }
  }

  removeEquipmentItem() {
    this.selectedEquipment = null;
  }

  openSearchTool(content) {
    this.modalService.open(content, {
      backdrop: false,
      windowClass: 'search-tool-modal'
    });
  }

  updateMaterials(ev) {
    if (ev) {
      this.selectedMaterials = ev.selectedData.map(item => ({
        ...item,
        name: item.Material
      }));
      this.form.setValue({
        ...this.form.value,
        material: this.selectedMaterials.map(item => item.id)
      });
    }
    this.closeModal();
  }

  updateEquipments(ev) {
    if (ev) {
      this.selectedEquipment = {
        ...ev.selectedData[0],
        name: ev.selectedData[0].Equipment
      };
      this.form.setValue({
        ...this.form.value,
        equipment: this.selectedEquipment.id
      });
      this.clearStoreEquipment();
    }
    this.closeModal();
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  get selectedMaterialNames() {
    return this.selectedMaterials.map(item => item.name);
  }

  get selectedEquipmentNames() {
    return this.selectedEquipment ? [this.selectedEquipment.name] : [];
  }
}
