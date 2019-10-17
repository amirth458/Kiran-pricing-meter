import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FilterOption } from 'src/app/model/vendor.model';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-profile-screener',
  templateUrl: './profile-screener.component.html',
  styleUrls: ['./profile-screener.component.css']
})
export class ProfileScreenerComponent implements OnInit {

  @ViewChild('infoModal') infoModal: ElementRef;
  error = '';
  uploadImage = '../../../assets/image/example_machine.png';
  details = {
    volume: {
      value: '',
      unit: ''
    },
    extents: [{
      value: '',
      unit: ''
    }, {
      value: '',
      unit: ''
    }, {
      value: '',
      unit: ''
    }],
    boundingBox: {
      value: '',
      unit: ''
    }, surfaceArea: {
      value: '',
      unit: ''
    },
    thinnestWall: {
      value: '',
      unit: ''
    }
  };


  form: FormGroup = this.fb.group({
    certification: '',
    NDA: '',
    equipment: null,
    materialList: [[]],
    tolerance: null,
    surfaceRoughness: null,
    timeToShip: '',
  });

  units = [];
  volumeUnits = [];
  lengthUnits = [];
  areaUnits = [];
  certifications = [];
  materials = [];
  equipments = [];
  timeToShip = [
    { name: '1 business day', value: '1' },
    { name: '3 business days', value: '3' },
    { name: '5 business days', value: '5' },
    { name: '7 business days', value: '7' },
    { name: '10 business days', value: '10' }
  ];

  processProfiles = [];
  activeMode = 'default';

  constructor(
    public fb: FormBuilder,
    private vendorService: VendorService,
    private spineer: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public processMetaData: ProcessMetadataService,
    public processProfileService: ProcessProfileService,
    public route: Router
  ) {
    route.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const routeArray = this.route.url.split('/');
        if (routeArray.includes('pricing') && routeArray.includes('estimator')) {
          this.activeMode = 'pricing-estimator';
        } else {
          this.activeMode = 'default';
        }
      }
    });
  }

  async ngOnInit() {
    try {
      this.spineer.show();
      await this.getInputValues();

      const certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.VendorCertificate).toPromise();
      this.certifications = certifications.map((x) => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });

      const units = await this.processMetaData.getMeasurementUnitType().toPromise();
      this.units = units.metadataList;
      this.volumeUnits = this.units.filter(unit => unit.measurementType.name == 'volume');
      this.lengthUnits = this.units.filter(unit => unit.measurementType.name == 'length');
      this.areaUnits = this.units.filter(unit => unit.measurementType.name == 'area');

    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }


  async getInputValues() {
    let page = 0;
    const machines = [];
    const processProfiles = [];
    try {
      while (true) {
        const param: FilterOption = { size: 5000, sort: 'name,ASC', page, q: '' };
        const machineRes = await this.machineService.getMachinery(this.userService.getVendorInfo().id, param).toPromise();

        if (!machineRes.content || machineRes.content.length == 0) {
          break;
        }
        machines.push(...machineRes.content);
        page++;
      }
      if (this.activeMode === 'pricing-estimator') {
        const profileRes = await this.processProfileService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();
        this.processProfiles = profileRes.map(profile => {
          return { ...profile, checked: false };
        });
      }

      machines.map(machine => {
        this.equipments.push(machine);
      });
    } catch (e) {
      console.log(e);
    }
  }


  equipmentChanged() {
    const equipmentId = this.form.value.equipment;
    this.form.setValue({ ...this.form.value, materialList: [] });
    this.materials = [];
    this.equipments.map(x => {
      if (x.id == equipmentId) {
        this.materials = [...x.machineServingMaterialList];
      }
    });
  }

  materialChanged(editScreen = false) {
    const materialList = this.form.value.materialList;
    if (materialList.length) {

      if (editScreen && materialList.length == this.materials.length - 1) {
        this.form.setValue({
          ...this.form.value
        });
        return this.materials;
      } else {
        const lastInput = materialList[materialList.length - 1];
        if (lastInput === 'all-materials') {
          this.form.setValue({
            ...this.form.value
          });
          return this.materials;
        } else {
          if (materialList.includes('all-materials')) {
            const startIndex = materialList.indexOf('all-materials');
            const frontSlice = materialList.slice(0, startIndex);
            const endSlice = materialList.slice(startIndex + 1);
            this.form.setValue({
              ...this.form.value,
              materialList: [...frontSlice, ...endSlice]
            });
            return [...frontSlice, ...endSlice];
          }
        }
      }
    }
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  toggleCheck(index) {
    console.log(this.processProfiles, index);
    this.processProfiles[index].checked = !this.processProfiles[index].checked;
  }

  toggleModal() {
    this.infoModal.nativeElement.click();
  }
}
