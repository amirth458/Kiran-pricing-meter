import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorService } from 'src/app/service/vendor.service';
import { VendorMetaDataTypes } from 'src/app/mockData/vendor';
import { FilterOption } from 'src/app/model/vendor.model';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { ConnectorService } from 'src/app/service/connector.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { Router, NavigationEnd } from '@angular/router';
import { ProfileScreenerService } from 'src/app/service/profile-screener.service';
import { EventEmitterService } from '../event-emitter.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  SetRFQInfo,
  SetScreenedProfiles,
  SetStatus,
  SetEstimatedPrices
} from 'src/app/store/profile-screener-estimator/profile-screener-estimator.actions';
import { HttpEventType } from '@angular/common/http';
import { map } from 'src/app/store';

@Component({
  selector: 'app-profile-screener',
  templateUrl: './profile-screener.component.html',
  styleUrls: ['./profile-screener.component.css']
})
export class ProfileScreenerComponent implements OnInit, AfterViewInit {


  @ViewChild('infoModal') infoModal: ElementRef;
  error = '';
  uploadImage = '../../../assets/image/example_machine.png';
  details = {
    quantity: '',
    volume: {
      value: 0,
      unitId: ''
    },

    buildingX: {
      value: 0,
      unitId: ''
    },
    buildingY: {
      value: 0,
      unitId: ''
    },
    buildingZ: {
      value: 0,
      unitId: ''
    }
    ,
    boundingBox: {
      value: 0,
      unitId: ''
    },
    surfaceArea: {
      value: 0,
      unitId: ''
    },
    minWallThickness: {
      value: 0,
      unitId: ''
    },
    estMachineTime: {
      value: 0,
      unitId: ''
    },
    toleranceIncrement: {
      value: 0,
      unitId: ''
    }
  };

  cubicUnitMapping = {
    centimetres: 'cubic centimetre',
    feet: 'cubic foot',
    inch: 'cubic inch',
    metre: 'cubic centimetre',
    'micro-Inch': 'cubic inch',
    micrometre: 'cubic centimetre',
    millimetre: 'cubic centimetre',
  };
  squareUnitMapping = {
    centimetres: 'square centimetre',
    feet: 'square foot',
    inch: 'square inch',
    metre: 'square centimetre',
    'micro-Inch': 'square inch',
    micrometre: 'square centimetre',
    millimetre: 'square centimetre',
  };

  // form: FormGroup = this.fb.group({
  //   requiredCertificateId: [''],
  //   materialId: [null],
  //   equipmentId: [null],
  //   confidentialityId: [''],

  //   // quantity: ['', Validators.required],

  //   timeToShipValue: [null],
  //   toleranceValue: [null],
  //   surfaceRoughnessValue: [null],
  //   surfaceFinishValue: [null],

  //   timeToShipUnit: [''],
  //   toleranceUnit: [''],
  //   surfaceRoughnessUnit: [''],
  //   surfaceFinishUnit: [''],
  // });

  form = {
    requiredCertificateId: null,
    materialId: null,
    equipmentId: null,
    confidentialityId: null,



    timeToShipValue: null,
    toleranceValue: null,
    surfaceRoughnessValue: null,
    surfaceFinishValue: null,

    timeToShipUnit: '',
    toleranceUnit: '',
    surfaceRoughnessUnit: '',
    surfaceFinishUnit: ''
  };

  units = [];

  volumeUnits = [];
  lengthUnits = [];
  areaUnits = [];
  dateTimeUnits = [];
  surfaceRoughnessUnits = [];

  estimatedMachineTimeUnits = [];
  confidentialities = [];
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

  uploadedDocuments = [];
  selectedDocument = null;
  uploading = false;
  triedToSubmit = false;

  uploadResponse = { status: '', message: '', filePath: '' };
  pendingDocumentIds = [];
  pendingTimer = false;
  progressMessage = 'Uploading...';
  analyzingText = 'Analyzing...';
  progressAnalysis = 0;
  RFQData: any = {};
  screenedProfiles = [];
  intervalsOfDetailedInformation = 4000;
  
  processProfiles = [];
  profileTypes = [];
  activeMode = 'default';
  isFormValid = false;

  searchQuery = '';

  screenerEstimatorStore$: Observable<any>;

  constructor(
    public fb: FormBuilder,
    public vendorService: VendorService,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public processMetaData: ProcessMetadataService,
    public processProfileService: ProcessProfileService,
    public route: Router,
    public profileScreererService: ProfileScreenerService,
    public eventEmitterService: EventEmitterService,
    public store: Store<any>,
    public connectorService: ConnectorService
  ) {

    this.screenerEstimatorStore$ = store.pipe(select('screenerEstimator'));
    this.screenerEstimatorStore$.subscribe(result => {
      this.RFQData = result.RFQInfo;
      this.screenedProfiles = result.screenedProfiles.map(item => item.profileId);

      if (this.RFQData.partMetadata) {
        this.details = this.RFQData.partMetadata;
      }

      if (this.RFQData.fileInfo) {
        this.selectedDocument = this.RFQData.fileInfo;
      }

      if (this.RFQData.fileInfo && this.RFQData.fileInfo.uploadedDocuments) {
        this.uploadedDocuments = this.RFQData.fileInfo.uploadedDocuments;
      }


      this.form = {
        requiredCertificateId: this.RFQData.requiredCertificateId || '',
        materialId: this.RFQData.materialId || null,
        equipmentId: this.RFQData.equipmentId || null,
        confidentialityId: this.RFQData.confidentialityId || '',
        // quantity: this.RFQData.quantity || '',
        timeToShipValue: this.RFQData && this.RFQData.timeToShip ? this.RFQData.timeToShip.value : null,
        timeToShipUnit: this.RFQData && this.RFQData.timeToShip ? this.RFQData.timeToShip.unitId : '',

        toleranceValue: this.RFQData && this.RFQData.tolerance ? this.RFQData.tolerance.value : null,
        toleranceUnit: this.RFQData && this.RFQData.tolerance ? this.RFQData.tolerance.unitId : '',

        surfaceRoughnessValue: this.RFQData && this.RFQData.surfaceRoughness ? this.RFQData.surfaceRoughness.value : null,
        surfaceRoughnessUnit: this.RFQData && this.RFQData.surfaceRoughness ? this.RFQData.surfaceRoughness.unitId : '',

        surfaceFinishValue: this.RFQData && this.RFQData.surfaceFinish ? this.RFQData.surfaceFinish.value : null,
        surfaceFinishUnit: this.RFQData && this.RFQData.surfaceFinish ? this.RFQData.surfaceFinish.unitId : ''
      };
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
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        processScreenEvent.subscribe((url: string) => {
          this.save(url);
        });
    }
    try {
      this.spineer.show();
      await this.getInputValues();

      const confidentialityList = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.Confidentiality).toPromise();
      this.confidentialities = confidentialityList;


      const certifications = await this.vendorService.getVendorMetaData(VendorMetaDataTypes.FacilityCertificate).toPromise();
      this.certifications = certifications.map((x) => {
        const name = this.htmlDecode(x.name);
        return {
          id: x.id,
          name
        };
      });
      const res = await this.processMetaData.getProcessProfileType().toPromise();
      this.profileTypes = res.metadataList;

      const units = await this.processMetaData.getMeasurementUnitType().toPromise();
      this.units = units.metadataList;
      this.volumeUnits = this.units.filter(unit => unit.measurementType.name === 'volume');
      this.lengthUnits = this.units.filter(unit => unit.measurementType.name === 'length');
      this.areaUnits = this.units.filter(unit => unit.measurementType.name === 'area');
      this.dateTimeUnits = this.units.filter(unit => unit.measurementType.name === 'datetime');
      this.surfaceRoughnessUnits = this.units.filter(unit => unit.measurementType.name === 'surface roughness');


      if (this.RFQData.equipmentId != null) {
        this.equipmentChanged();
      }

      this.form.materialId = this.RFQData.materialId || null;

    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  ngAfterViewInit(): void {
  }

  get fileNames() {
    let name = '';
    this.uploadedDocuments.map((file, index) => {
      if (index === 0) {
        name += file.fileName;
      } else {
        name += ', ' + file.fileName;

      }
    });
    return name;
  }

  async getInputValues() {
    let page = 0;
    const machines = [];
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
          return { ...profile, checked: false, show: true };
        });

        if (this.screenedProfiles.length > 0) {
          this.processProfiles.map((item, index) => {
            if (this.screenedProfiles.filter(i => i == item.id).length) {
              this.processProfiles[index].checked = true;
            }
          });
        }

      }

      const equipmentId = [];

      machines.map(machine => {
        if (!equipmentId.includes(machine.equipment.id)) {
          this.equipments.push(machine);
          equipmentId.push(machine.equipment.id);
        }
      });

    } catch (e) {
      console.log(e);
    }
  }

  getUnitName(id) {
    const unit = this.units.filter(u => u.id == id);
    if (unit.length) {
      return unit[0].symbol || unit[0].displayName;
    }
    return '';
  }

  getUnitId(strUnit: string, unitType: number ) {
    if (strUnit === 'centimeters') {
      strUnit = 'centimetres';
    }

    let unitId = 0;
    switch (unitType) {
      case 1:
        // length Unit
        const unit = this.lengthUnits.find(item => item.name === strUnit);
        if (unit) {
          unitId = unit.id;
        } else {
          unitId = 0;
        }
        break;
      case 2:
        // square unit
        const unitNameL = this.squareUnitMapping[strUnit];
        const unitL = this.areaUnits.find(item => item.name === unitNameL);
        if (unitL) {
          unitId = unitL.id;
        } else {
          unitId = 0;
        }
        break;
      case 3:
        // cubic unit
        const unitNameC = this.cubicUnitMapping[strUnit];
        const unitC = this.volumeUnits.find(item => item.name === unitNameC);
        if (unitC) {
          unitId = unitC.id;
        } else {
          unitId = 0;
        }
        break;
    }
    return unitId.toString();
  }

  extentUnitSet() {
    const unitId = this.details.buildingX.unitId;
    this.details.buildingY.unitId = unitId;
    this.details.buildingZ.unitId = unitId;
    if (unitId) {
      const unit = this.lengthUnits.filter(item => item.id == unitId);
      const volumeUnit = this.volumeUnits.filter(u => u.name == this.cubicUnitMapping[unit[0].name]);
      if (volumeUnit.length > 0) {
        this.details.boundingBox.unitId = volumeUnit[0].id;
      } else {
        this.details.boundingBox.unitId = '';
      }
    } else {
      this.details.boundingBox.unitId = '';
    }

  }

  equipmentChanged() {
    const equipmentId = this.form.equipmentId;
    this.form = { ...this.form, materialId: null };
    this.materials = [];
    this.equipments.map(x => {
      if (x.equipment.id == equipmentId) {
        this.materials = [...x.machineServingMaterialList];
      }
    });
  }

  materialChanged(editScreen = false) {
    const materialList = [this.form.materialId];
    if (materialList.length) {

      if (editScreen && materialList.length === this.materials.length - 1) {
        this.form = {
          ...this.form
        };
        return this.materials;
      } else {
        const lastInput = materialList[materialList.length - 1];
        if (lastInput === 'all-materials') {
          this.form = {
            ...this.form
          };
          return this.materials;
        } else {
          if (materialList.includes('all-materials')) {
            const startIndex = materialList.indexOf('all-materials');
            const frontSlice = materialList.slice(0, startIndex);
            const endSlice = materialList.slice(startIndex + 1);
            this.form = {
              ...this.form,
              // materialList: [...frontSlice, ...endSlice]
            };
            return [...frontSlice, ...endSlice];
          }
        }
      }
    }
  }

  isSelectedDocument(): boolean {
    let selected = false;
    if (this.selectedDocument) {
      selected = true;
    }
    return selected;
  }

  onOpenFile(event) {
    // tslint:disable-next-line: deprecation
    $('#file').click();
  }

  onRemoveFile(id) {
    this.uploadedDocuments = this.uploadedDocuments.filter((item) => item.id !== id);
    if (this.selectedDocument) {
      if (id === this.selectedDocument.id) {
        this.selectedDocument = null;
      }
    }
  }

  onFileChange(fileInput) {
    this.progressMessage = 'Uploading...';

    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files.item(0);

      this.uploading = true;
      this.connectorService.fileUploadForProcessScreener(file)
        .pipe(map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total);
              return { status: 'progress', message: progress };
            case HttpEventType.Response:
              return { ...event.body, message: 50 };
            default:
              return `Unhandled event: ${event.type}`;
          }
        }))
        .subscribe(
          (res: any) => {
            this.uploadResponse = res;
            if (res.fileName) {
              this.uploading = false;
              this.uploadedDocuments = this.uploadedDocuments.map(item => ({ ...item, selected: 0 }));
              this.uploadedDocuments.push({ ...res, selected: 1, fileName: file.name, analyzing: 0 });
              this.pendingDocumentIds.push(res.id);
              this.selectedDocument = this.uploadedDocuments[this.uploadedDocuments.length - 1];
              if (!this.pendingTimer) {
                this.pendingTimer = true;
                setTimeout(async () => {
                  await this.getDetailedInformation();
                }, this.intervalsOfDetailedInformation);
              }
            }
          },
          (err) => this.error = err
        );
    }
  }

  async getDetailedInformation() {
    this.pendingDocumentIds.map(async (id) => {
      const resp = await this.connectorService.getMetaDataForProcessScreener(id).toPromise();
      if (resp.status === 'COMPLETED' || resp.status === 'FAILED' ) {
        this.uploadedDocuments = this.uploadedDocuments.map((item) => {
          if (item.id === id) {
            return { ...item, ...resp, analyzing: 100 };
          } else {
            return { ...item };
          }
        });
        this.pendingDocumentIds = this.pendingDocumentIds.filter((pendingId) => pendingId !== id);
        if (this.selectedDocument) {
          const selectedId = this.selectedDocument.id;
          this.selectedDocument = this.uploadedDocuments.filter(document => document.id === selectedId)[0];
          console.log(this.selectedDocument);
          this.details.volume.value = Math.round(this.selectedDocument.volume.value * 100) / 100;
          this.details.volume.unitId = this.getUnitId(this.selectedDocument.volume.unit, 3);
          this.details.buildingX.value = Math.round(this.selectedDocument.xextent.value * 100) / 100;
          this.details.buildingX.unitId = this.getUnitId(this.selectedDocument.xextent.unit, 1);
          this.details.buildingY.value = Math.round(this.selectedDocument.yextent.value * 100) / 100;
          this.details.buildingY.unitId = this.getUnitId(this.selectedDocument.yextent.unit, 1);
          this.details.buildingZ.value = Math.round(this.selectedDocument.zextent.value * 100) / 100;
          this.details.buildingZ.unitId = this.getUnitId(this.selectedDocument.zextent.unit, 1);
          this.details.surfaceArea.value = Math.round(this.selectedDocument.surface.value * 100) / 100;
          this.details.surfaceArea.unitId = this.getUnitId(this.selectedDocument.surface.unit, 2);
        }
      } else if (resp.status === 'RUNNING') {
        this.uploadedDocuments = this.uploadedDocuments.map((item) => {
          if (item.id === id) {
            if (item.analyzing < 90) {
              return { ...item, ...resp, analyzing: item.analyzing + 10 };
            } else {
              return { ...item };
            }
          } else {
            return { ...item };
          }
        });
        const selectedId = this.selectedDocument.id;
        this.selectedDocument = this.uploadedDocuments.filter(document => document.id === selectedId)[0];
      }
    });
    if (this.pendingDocumentIds.length === 0) {
      this.pendingTimer = false;
    } else {
      setTimeout(async () => {
        await this.getDetailedInformation();
      }, this.intervalsOfDetailedInformation);
    }
  }

  formatValue(num): number {
    return Math.round(num * 100) / 100;
  }

  onSelectFile(fileId) {
    this.uploadedDocuments = this.uploadedDocuments.map(item => {
      if (item.id === fileId) {
        this.selectedDocument = item;
        return {
          ...item,
          selected: 1,
        };
      } else {
        return {
          ...item,
          selected: 0,
        };
      }
    });
  }


  onProcessProfileSearch() {
    this.processProfiles.map((profile, index) => {
      if (!profile.name.toLocaleLowerCase().includes(this.searchQuery)) {
        this.processProfiles[index].show = false;
      } else {
        this.processProfiles[index].show = true;
      }
    });
  }

  htmlDecode(input) {
    const str = input;
    str.replace(/[&amp;]/g, '&#38;');
    return str;
  }

  toggleCheck(profileId) {
    this.processProfiles.map((profile, index) => {
      if (profile.id == profileId) {
        this.processProfiles[index].checked = !this.processProfiles[index].checked;
      }
    });
  }

  toggleModal() {
    this.infoModal.nativeElement.click();
  }

  save(url = '') {
    let gotoURL = '';

    if (this.activeMode === 'pricing-estimator') {
      gotoURL = '/profile/processes/pricing/estimator/process';
    }
    if (this.activeMode === 'default') {
      gotoURL = '/profile/processes/profile/profile-screener/process';
    }

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


    this.triedToSubmit = true;

    if (this.isFormValid) {

      // tslint:disable-next-line:max-line-length
      this.details.boundingBox.value = Math.round(
        Number(this.details.buildingX.value) *
        Number(this.details.buildingY.value) *
        Number(this.details.buildingZ.value) * 100) / 100;

      const postData = {
        // ...this.form,
        requiredCertificateId: this.form.requiredCertificateId,
        materialId: this.form.materialId,
        equipmentId: this.form.equipmentId,
        confidentialityId: this.form.confidentialityId,


        timeToShip: {
          value: this.form.timeToShipValue,
          unitId: this.form.timeToShipUnit
        },
        tolerance: {
          value: this.form.toleranceValue,
          unitId: this.form.toleranceUnit
        },
        surfaceRoughness: {
          value: this.form.surfaceRoughnessValue,
          unitId: this.form.surfaceRoughnessUnit
        },
        surfaceFinish: {
          value: this.form.surfaceFinishValue,
          unitId: this.form.surfaceFinishUnit
        },

        processProfileIdList: [
          ...this.processProfiles
            .filter(profile => profile.checked)
            .map(profile => profile.id)],
        partMetadata: this.details,
        profileTypeId: this.profileTypes.filter(item => item.name === 'Processing')[0].id

      };

      this.store.dispatch(new SetRFQInfo({
        ...postData,
        fileInfo: {
          ...this.selectedDocument,
          uploadedDocuments: this.uploadedDocuments
        }
      }));

      this.store.dispatch(new SetStatus('PENDING'));
      if (!gotoURL.includes('estimator')) {
        this.store.dispatch(new SetScreenedProfiles([]));
        this.store.dispatch(new SetEstimatedPrices([]));
        this.profileScreererService.screenProfiles(this.userService.getUserInfo().id || null, postData)
          .subscribe(res => {
            console.log({ res });
            this.store.dispatch(new SetScreenedProfiles(res));
            this.store.dispatch(new SetStatus('DONE'));
          });
      } else if (gotoURL.includes('estimator')) {
        this.store.dispatch(new SetEstimatedPrices([]));
        this.store.dispatch(new SetScreenedProfiles(postData.processProfileIdList.map(item => {
          return { profileId: item };
        })));
      }
      this.route.navigateByUrl(gotoURL);
    } else {
      console.log('not valid');
    }
  }
}
