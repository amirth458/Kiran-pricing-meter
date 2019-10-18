import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FilterOption } from 'src/app/model/vendor.model';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { Router, NavigationEnd } from '@angular/router';
import { ProfileScreenerService } from 'src/app/service/profile-screener.service';
import { EventEmitterService } from '../event-emitter.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  SetRFQInfo,
  SetScreenedProfiles,
  SetStatus
} from 'src/app/store/profile-screener-estimator/profile-screener-estimator.actions';

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
    requiredCertificateId: ['', Validators.required],
    materialId: [null, Validators.required],
    equipmentId: [null, Validators.required],
    confidentialityId: ['', Validators.required],

    quantity: ['', Validators.required],

    deliveryStatementId: ['', Validators.required],
    tolerance: [null, Validators.required],
    surfaceRoughness: [null, Validators.required],
    surfaceFinish: [null, Validators.required],
  });

  units = [];
  volumeUnits = [];
  lengthUnits = [];
  areaUnits = [];
  certifications = [];
  materials = [];
  equipments = [];
  timeToShip = [
    { name: '1 business day', id: '1' },
    { name: '3 business days', id: '3' },
    { name: '5 business days', id: '5' },
    { name: '7 business days', id: '7' },
    { name: '10 business days', id: '10' }
  ];

  RFQData: any = {};
  screenedProfiles = [];

  processProfiles = [];
  activeMode = 'default';
  isFormValid = false;

  screenerEstimatorStore$: Observable<any>;

  constructor(
    public fb: FormBuilder,
    private vendorService: VendorService,
    private spineer: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public processMetaData: ProcessMetadataService,
    public processProfileService: ProcessProfileService,
    public route: Router,
    public profileScreererService: ProfileScreenerService,
    public eventEmitterService: EventEmitterService,
    public store: Store<any>
  ) {

    this.screenerEstimatorStore$ = store.pipe(select('screenerEstimator'));
    this.screenerEstimatorStore$.subscribe(result => {
      this.RFQData = result.RFQInfo;
      this.screenedProfiles = result.screenedProfiles;

      this.form.setValue({
        requiredCertificateId: this.RFQData.requiredCertificateId || '',
        materialId: this.RFQData.materialId || null,
        equipmentId: this.RFQData.equipmentId || null,
        confidentialityId: this.RFQData.confidentialityId || '',
        quantity: this.RFQData.quantity || '',
        deliveryStatementId: this.RFQData.deliveryStatementId || '',
        tolerance: this.RFQData.tolerance || null,
        surfaceRoughness: this.RFQData.surfaceRoughness || null,
        surfaceFinish: this.RFQData.surfaceFinish || null,
      });

    });

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
      this.volumeUnits = this.units.filter(unit => unit.measurementType.name === 'volume');
      this.lengthUnits = this.units.filter(unit => unit.measurementType.name === 'length');
      this.areaUnits = this.units.filter(unit => unit.measurementType.name === 'area');

      // console.log(this.eventEmitterService.subsVar, this.eventEmitterService.subsVar == undefined);
      if (this.eventEmitterService.subsVar == undefined) {
        this.eventEmitterService.subsVar = this.eventEmitterService.
          processScreenEvent.subscribe((url: string) => {
            this.save(url);
          });
      }


    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  get quantity() {
    return this.form.value.quantity;
  }

  async getInputValues() {
    let page = 0;
    const machines = [];
    const processProfiles = [];
    try {
      while (true) {
        const param: FilterOption = { size: 5000, sort: 'name,ASC', page, q: '' };
        const machineRes = await this.machineService.getMachinery(this.userService.getVendorInfo().id, param).toPromise();

        if (!machineRes.content || machineRes.content.length === 0) {
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

        if (this.screenedProfiles.length > 0) {
          this.processProfiles.map((item, index) => {
            if (this.screenedProfiles.filter(i => i == item.id).length) {
              this.processProfiles[index].checked = true;
            }
          });
        }

      }

      machines.map(machine => {
        this.equipments.push(machine);
      });
    } catch (e) {
      console.log(e);
    }
  }


  equipmentChanged() {
    const equipmentId = this.form.value.equipmentId;
    this.form.setValue({ ...this.form.value, materialId: null });
    this.materials = [];
    this.equipments.map(x => {
      if (x.id == equipmentId) {
        this.materials = [...x.machineServingMaterialList];
      }
    });
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  toggleCheck(index) {
    this.processProfiles[index].checked = !this.processProfiles[index].checked;
  }

  toggleModal() {
    this.infoModal.nativeElement.click();
  }

  save(url) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        this.isFormValid = false;
      } else {
        this.isFormValid = true;
      }
      form.classList.add('was-validated');

    });

    console.log(this.form.value);
    if (this.form.valid && this.isFormValid) {
      const postData = {
        ...this.form.value, processProfileIdList: [
          ...this.processProfiles
            .filter(profile => profile.checked)
            .map(profile => profile.id)]
      };

      this.store.dispatch(new SetRFQInfo(postData));
      this.store.dispatch(new SetStatus('PENDING'));

      if (!url.includes('estimator')) {
        this.profileScreererService.screenProfiles(this.userService.getVendorInfo().id, postData)
          .subscribe(res => {
            this.store.dispatch(new SetScreenedProfiles(res));
            this.store.dispatch(new SetStatus('DONE'));
          });
      } else {
        this.store.dispatch(new SetScreenedProfiles(postData.processProfileIdList));
      }
      this.route.navigateByUrl(url);
    } else {
      console.log('not valid');
    }
  }
}
