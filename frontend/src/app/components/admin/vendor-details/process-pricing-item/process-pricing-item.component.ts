import { Component, OnInit, AfterViewChecked, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';
import { PricingMetadataService } from 'src/app/service/pricing-metadata.service';
import { GridOptions } from 'ag-grid-community';
import { DropdownCellRendererComponent } from 'src/app/common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { MultiSelectCellRendererComponent } from 'src/app/common/multi-select-cell-renderer/multi-select-cell-renderer.component';
import { MultiSelectCellEditorComponent } from 'src/app/common/multi-select-cell-editor/multi-select-cell-editor.component';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { Observable, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { BidOrder } from 'src/app/model/order.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PricingProfile, ProcessProfile } from 'src/app/model/part.model';
import { FeatureTypeIdEnum } from 'src/app/model/subscription.model';

@Component({
  selector: 'app-process-pricing-item',
  templateUrl: './process-pricing-item.component.html',
  styleUrls: ['./process-pricing-item.component.css']
})
export class ProcessPricingItemComponent implements OnInit, AfterViewChecked {
  @ViewChild('numberInput') numberInput: ElementRef;
  @ViewChild('associatePricingProfiles') associatePricingProfiles: ElementRef;

  featureTypes = FeatureTypeIdEnum;
  form: FormGroup = this.fb.group({
    id: '',
    pricingProfileName: [null, Validators.required],
    processProfileId: ['', Validators.required],
    processPricingConditionList: [[]],
    processPricingParameterList: [[]]
  });

  processPricingId = null;

  pricingParameterGroup = [];
  processProfiles = [];
  units = [];
  defaultUnits = [];
  signTypes = [];

  conditions = [];
  selectedPricingConditionList = [
    // {
    //   operatorType: {
    //     id: ''
    //   },
    //   processPricingConditionType: {
    //     id: ''
    //   },
    //   unitType: {
    //     id: ''
    //   },
    //   value: '',
    //   valueInDefaultUnit: '',
    //   valueSignType: {
    //     id: ''
    //   },
    //   operandTypeList: [],
    //   units: []
    // }
  ];

  conditionTypes = [];
  conditionParameters = [];
  invoiceLineItems = [];

  isNew = true;
  error = '';
  isFormValid = false;
  isDataLoaded = false;

  flatGridOptions: GridOptions;
  variableGridOptions: GridOptions;
  multiplierGridOptions: GridOptions;

  flatRowData = [];
  variableRowData = [];
  multiplierRowData = [];

  flatConditions = {
    invoiceItem: [],
    invoiceLineItems: []
  };
  variableConditions = {
    invoiceItem: [],
    invoiceLineItems: [],
    unit: [],
    partValue: [],
    conditionTypes: []
  };
  multiplierConditions = {
    invoiceItem: [],
    filteredInvoiceItem: [],
    invoiceLineItems: []
  };
  editType = 'fullRow';

  vendorId;
  vendorUserId;

  frameworkComponents = {
    multiselectCellRenderer: MultiSelectCellRendererComponent,
    multiselectCellEditor: MultiSelectCellEditorComponent,
    dropdownCellRenderer: DropdownCellRendererComponent,
    actionCellRenderer: ActionCellRendererComponent,
    templateRenderer: TemplateRendererComponent
  };

  flatColumnDefs: Array<any> = [];
  variableColumnDefs: Array<any> = [];
  multiplierColumnDefs: Array<any> = [];

  flatLineItem = [];
  variableLineItem = [];

  invoiceItems = [];

  gridHasInvalidInput = false;

  pendingOfferStore$: Observable<any>;
  bidOrder: BidOrder;

  productionProjectStore$: Observable<any>;
  productionProjectId;

  saveToAssociate = false;
  selectedPricingProfile = null;
  selectedProfilesForAssociating = {};
  fallbackUrl = null;

  defaultProcessProfileId = null;

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaDataService: ProcessMetadataService,
    public pricingMetaDataService: PricingMetadataService,
    public processProfileService: ProcessProfileService,
    public processPricingService: ProcessPricingService,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    public store: Store<any>,
    public modalService: NgbModal,
    public toaster: ToastrService
  ) {
    this.fallbackUrl = localStorage.getItem('pricing-return');

    const currentNavigation = this.route.getCurrentNavigation();
    if (
      currentNavigation &&
      currentNavigation.extras &&
      currentNavigation.extras.state &&
      currentNavigation.extras.state.selectedProcessProfileId
    ) {
      this.defaultProcessProfileId = currentNavigation.extras.state.selectedProcessProfileId;
      this.form.setValue({
        ...this.form.value,
        processProfileId: this.defaultProcessProfileId
      });
    }
  }

  async ngOnInit() {
    try {
      const routeParams = this.route.url.split('/');
      this.vendorUserId = routeParams[3];
      const vendorUserDetails = await this.userService.getUserDetails(this.vendorUserId).toPromise();
      this.vendorId = vendorUserDetails.vendor.id;

      this.spinner.show();

      this.processProfiles = ((await this.processProfileService.getAllProfiles(this.vendorId).toPromise()) || []).sort(
        (prev: ProcessProfile, curr: ProcessProfile) => Number(prev.name > curr.name) - Number(prev.name < curr.name)
      );

      const signType = await this.processMetaDataService.getValueSignType().toPromise();
      const units = await this.processMetaDataService.getMeasurementUnitType().toPromise();
      const conditionTypes = await this.pricingMetaDataService.getConditionTypes().toPromise();
      const conditionParameters = await this.pricingMetaDataService.getConditionParameters().toPromise();
      // const pricingParameterGroup = await this.pricingMetaDataService.getParameterGroup().toPromise();
      // const conditionParameters = await this.pricingMetaDataService.getConditionParameters().toPromise();
      // const invoiceItems = await this.pricingMetaDataService.getInvoiceItems().toPromise();
      const invoiceLineItems = await this.pricingMetaDataService.getInvoiceLineItems().toPromise();

      // this.conditionTypes = conditionTypes.metadataList;
      // this.conditionParameters = conditionParameters.metadataList;

      const operatorType = await this.processMetaDataService.getoperatorType().toPromise();
      // const currency = await this.processMetaDataService.getCurrency(true).toPromise();

      operatorType.metadataList.map(operator => {
        const addedList = Object.keys(this.conditions);
        if (addedList.includes(operator.operandType.name)) {
          this.conditions[operator.operandType.name].push(operator);
        } else {
          this.conditions[operator.operandType.name] = [operator];
        }
      });

      const invoiceItems = [];
      const visitedInvoiceItems = [];
      invoiceLineItems.metadataList.map(item => {
        const identifier = JSON.stringify(
          JSON.stringify(item.invoiceItem) + JSON.stringify(item.processPricingParameterGroup)
        );
        if (!visitedInvoiceItems.includes(identifier)) {
          visitedInvoiceItems.push(identifier);
          invoiceItems.push({
            ...item.invoiceItem,
            processPricingParameterGroup: item.processPricingParameterGroup
          });
        }
      });

      this.flatConditions.invoiceItem = invoiceItems.filter(
        item => item.processPricingParameterGroup.name === 'flat_charges'
      );
      this.variableConditions.invoiceItem = invoiceItems.filter(
        item => item.processPricingParameterGroup.name === 'variable_charges'
      );
      this.multiplierConditions.invoiceItem = invoiceItems.filter(
        item => item.processPricingParameterGroup.name === 'multipliers'
      );

      this.flatConditions.invoiceLineItems = invoiceLineItems.metadataList.filter(
        item => item.processPricingParameterGroup.name === 'flat_charges'
      );
      this.variableConditions.invoiceLineItems = invoiceLineItems.metadataList.filter(
        item => item.processPricingParameterGroup.name === 'variable_charges'
      );
      this.multiplierConditions.invoiceLineItems = invoiceLineItems.metadataList.filter(
        item => item.processPricingParameterGroup.name === 'multipliers'
      );

      this.conditionParameters = conditionParameters.metadataList;

      this.variableConditions.conditionTypes = [];
      this.variableConditions.unit = units.metadataList;

      this.conditionTypes = conditionTypes.metadataList;
      this.units = units.metadataList;
      this.defaultUnits = this.units.filter(item => item.isDefault);
      this.signTypes = signType.metadataList;

      // this.pricingParameterGroup = pricingParameterGroup.metadataList;
      this.setColumnDefs();
      this.setGridOptions();

      this.isDataLoaded = true;
    } catch (e) {
      console.log(e);
    } finally {
      if (this.route.url.includes('edit')) {
        this.isNew = false;
        this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        // tslint:disable-next-line:max-line-length
        const processProfile = await this.processPricingService
          .getProfile(this.vendorId, this.processPricingId)
          .toPromise();
        this.initForm(processProfile);
        this.processProfileChanged();
      }

      if (this.route.url.includes('clone')) {
        this.isNew = true;
        const processProfile = this.processPricingService.getCloneData();
        setTimeout(() => {
          this.initForm(processProfile);
          this.processProfileChanged();
        }, 100);
      }
      this.spinner.hide();
    }
  }

  get name() {
    return this.form.value.pricingProfileName;
  }

  get processProfileNeedsModification() {
    let profileHasProcessSpeed = false;
    let requiredprocessPricingCondition = false;

    if ((this.selectedPricingConditionList || []).length) {
      requiredprocessPricingCondition =
        this.selectedPricingConditionList.filter(
          condition => condition.processPricingConditionType.name === 'Estimated Machine Time'
        ).length > 0;
    }

    if (requiredprocessPricingCondition) {
      const selectedProcessProfileFilter = this.processProfiles.filter(
        profile => profile.id == this.form.value.processProfileId
      );
      if (selectedProcessProfileFilter.length) {
        profileHasProcessSpeed = selectedProcessProfileFilter[0].processSpeedList.length === 0;
      }
    }
    return profileHasProcessSpeed && requiredprocessPricingCondition;
  }

  get profileName() {
    let name = '';
    if (this.form.value.processProfileId) {
      const profile = this.processProfiles.filter(p => p.id == this.form.value.processProfileId);
      name = profile.length ? profile[0].name : '';
    }
    return name;
  }

  conditionTypeDisabled(id) {
    return this.hasProcessSpeedList() === false && (id === 5 || id === 7 || id === 4) ? true : false;
  }

  get parameterDetails() {
    let name = '';
    this.selectedPricingConditionList.map(row => {
      if (row.operatorType.id && row.processPricingConditionType.id && row.unitType.id && row.value) {
        const parameter = this.conditionTypes.filter(item => item.id == row.processPricingConditionType.id);
        const parameterName = parameter.length ? parameter[0].name : '';
        const operator = row.operandTypeList.filter(operand => operand.id == row.operatorType.id);
        const unit = row.units.filter(unitItem => unitItem.id == row.unitType.id);
        if (parameter.length && unit.length && operator.length) {
          const operatorSymbol = operator[0].symbol;

          if (name.length > 1) {
            if (operatorSymbol === '=') {
              name += ', ' + row.value + ' ' + unit[0].displayName + ' ' + parameterName;
            } else {
              name += ', ' + operatorSymbol + ' ' + +row.value + ' ' + unit[0].displayName + ' ' + parameterName;
            }
          } else {
            if (operatorSymbol === '=') {
              name += row.value + ' ' + unit[0].displayName + ' ' + parameterName;
            } else {
              name += operatorSymbol + ' ' + +row.value + ' ' + unit[0].displayName + ' ' + parameterName;
            }
          }
        }
      }
    });
    return name;
  }

  onPropertyChange(conditionId, index, notInit = true) {
    let signTypeId = null;

    const operand = this.conditionTypes.filter(condition => condition.id == conditionId);
    const operandTypeName = operand.length ? operand[0].operandType.name : null;
    const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
    this.selectedPricingConditionList[index].operandTypeList = options;
    // tslint:disable-next-line:max-line-length
    this.selectedPricingConditionList[index].units = operand.length
      ? this.units.filter(unit => unit.measurementType.id == operand[0].measurementType.id)
      : [];

    if (operand.length && notInit) {
      const defaultValue = this.defaultUnits.filter(item => item.measurementType.id == operand[0].measurementType.id);
      this.selectedPricingConditionList[index].unitType.id = defaultValue.length ? defaultValue[0].id : '';
    }

    // tslint:disable-next-line:max-line-length
    const isSelectedUnitValid =
      this.selectedPricingConditionList[index].units.filter(
        u => u.id == this.selectedPricingConditionList[index].unitType.id
      ).length > 0;
    if (!isSelectedUnitValid) {
      this.selectedPricingConditionList[index].unitType.id = '';
    }

    if (operandTypeName === 'absolute') {
      signTypeId = this.signTypes.filter(x => x.name === 'absolute')[0].id;
    } else {
      signTypeId = this.signTypes.filter(x => x.name === 'positive')[0].id;
    }
    this.selectedPricingConditionList[index].valueSignType = {
      id: signTypeId
    };
  }

  processProfileChanged() {
    const selectedProcessProfileFilter = this.processProfiles.filter(
      profile => profile.id == this.form.value.processProfileId
    );
    const selectedProcessProfile = selectedProcessProfileFilter.length ? selectedProcessProfileFilter[0] : '';
    // tslint:disable-next-line:max-line-length
    const processTypeId = selectedProcessProfileFilter.length
      ? selectedProcessProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment
          .processFamily.processType.id
      : '';
    this.variableConditions.conditionTypes = this.conditionParameters.filter(
      param => param.processType.id == processTypeId
    );
    const temp = this.getRowData('variableCharges').map(
      row =>
        new Object({
          ...row
        })
    );
    this.variableRowData = temp;
  }

  hasProcessSpeedList() {
    const selectedProcessProfileFilter = this.processProfiles.filter(
      profile => profile.id == this.form.value.processProfileId
    );
    const selectedProcessProfile = selectedProcessProfileFilter.length ? selectedProcessProfileFilter[0] : '';
    return !(selectedProcessProfile.processSpeedList.length === 0);
  }

  initForm(pricingProfile) {
    let flatChargesFound = 0;
    let variableChargesFound = 0;
    let multiplierChargesFound = 0;
    this.form.setValue({
      id: pricingProfile.id,
      pricingProfileName: pricingProfile.name,
      processProfileId: pricingProfile.processProfile.id,
      processPricingConditionList: pricingProfile.processPricingConditionList,
      processPricingParameterList: pricingProfile.processPricingParameterList
    });

    this.selectedPricingConditionList = [];
    (pricingProfile.processPricingConditionList || []).map((condition, index) => {
      this.selectedPricingConditionList.push({
        ...condition,
        operandTypeList: [],
        units: []
      });
      this.onPropertyChange(condition.processPricingConditionType.id, index, false);
    });

    (pricingProfile.processPricingParameterList || []).map((parameter, index) => {
      let section = '';
      if (parameter.currency !== null && parameter.currency.id !== null && parameter.price !== null) {
        section = 'flatCharges';
      }
      if (
        parameter.currency &&
        parameter.currency.id &&
        parameter.price &&
        parameter.quantity &&
        parameter.quantityUnitType &&
        parameter.quantityUnitType.id &&
        parameter.processPricingConditionType &&
        parameter.processPricingConditionType.id
      ) {
        section = 'variableCharges';
      }
      if (
        parameter.currency &&
        parameter.currency.id &&
        parameter.multiplier &&
        parameter.multiplierProcessPricingParameter &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem.id
      ) {
        section = 'multiplierCharges';
      }

      if (section === 'flatCharges') {
        this.addCondition('flatCharges', parameter);
        this.dropdownValueChanged(
          {
            colDef: { field: 'invoiceItem' },
            data: {
              section: 'flatCharges'
            },
            rowIndex: flatChargesFound
          },
          parameter.invoiceLineItem.invoiceItem.id,
          true
        );
        flatChargesFound++;
      }
      if (section === 'variableCharges') {
        this.addCondition('variableCharges', parameter);
        this.dropdownValueChanged(
          {
            colDef: { field: 'invoiceItem' },
            data: {
              section: 'variableCharges'
            },
            rowIndex: variableChargesFound
          },
          parameter.invoiceLineItem.invoiceItem.id,
          true
        );
        this.dropdownValueChanged(
          {
            colDef: { field: 'invoiceLineItem' },
            data: {
              section: 'variableCharges'
            },
            rowIndex: variableChargesFound
          },
          parameter.invoiceLineItem.id,
          true
        );

        variableChargesFound++;
      }
      // if (section === 'multiplierCharges') {
      //   this.addCondition('multiplierCharges', parameter);
      //   this.dropdownValueChanged({
      //     colDef: { field: 'invoiceItem' },
      //     data: {
      //       section: 'multiplierCharges'
      //     },
      //     rowIndex: multiplierChargesFound
      //   }, parameter.invoiceLineItem.invoiceItem.id, true);
      //   multiplierChargesFound++;
      // }
    });

    (pricingProfile.processPricingParameterList || []).map((parameter, index) => {
      let section = '';

      if (
        parameter.currency.id &&
        parameter.multiplier &&
        parameter.multiplierProcessPricingParameter &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem.id
      ) {
        section = 'multiplierCharges';
      }

      if (section === 'multiplierCharges') {
        this.addCondition('multiplierCharges', parameter);
        this.dropdownValueChanged(
          {
            colDef: { field: 'invoiceItem' },
            data: {
              section: 'multiplierCharges'
            },
            rowIndex: multiplierChargesFound
          },
          parameter.invoiceLineItem.invoiceItem.id,
          true
        );

        this.dropdownValueChanged(
          {
            colDef: { field: 'invoiceLineItem' },
            data: {
              section: 'multiplierCharges'
            },
            rowIndex: multiplierChargesFound
          },
          parameter.invoiceLineItem.id,
          true
        );

        multiplierChargesFound++;
      }
    });
  }

  integerFormatter(value) {
    const data = value.data;
    if (!Number.isInteger(data.value)) {
      return '';
    }
    return data.value.toString();
  }

  setColumnDefs() {
    this.flatColumnDefs = [
      {
        headerName: 'Invoice Item',
        field: 'invoiceItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'flatCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Line Item',
        field: 'invoiceLineItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'flatCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Value ($)',
        field: 'value',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.numberInput
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.numberInput
        },
        valueFormatter: e => this.integerFormatter(e)
      },
      {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: param => {
              this.flatRowData = this.getRowData('flatCharges').filter((row, index) => index != param.rowIndex);
              this.dropdownValueChanged(
                {
                  colDef: {
                    field: 'multiplierValueRefresh'
                  },
                  data: {
                    section: 'multiplierCharges'
                  }
                },
                ''
              );
            },
            canDelete: true
          }
        }
      }
    ];

    this.variableColumnDefs = [
      {
        headerName: 'Invoice Item',
        field: 'invoiceItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Line Item',
        field: 'invoiceLineItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Value ($)',
        field: 'value',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.numberInput
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.numberInput
        },
        valueFormatter: e => this.integerFormatter(e)
      },
      // { headerName: 'Per', field: 'per', hide: false, sortable: false, filter: false, editable: false, width: 60 },
      {
        headerName: 'Per',
        field: 'quantity',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.numberInput
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.numberInput
        },
        valueFormatter: e => this.integerFormatter(e)
      },
      {
        headerName: 'Part Value',
        field: 'partValue',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Units',
        field: 'unit',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: param => {
              this.variableRowData = this.getRowData('variableCharges').filter((row, index) => index != param.rowIndex);
              this.dropdownValueChanged(
                {
                  colDef: {
                    field: 'multiplierValueRefresh'
                  },
                  data: {
                    section: 'multiplierCharges'
                  }
                },
                ''
              );
            },
            canDelete: true
          }
        }
      }
    ];

    this.multiplierColumnDefs = [
      {
        headerName: 'Invoice Item',
        field: 'invoiceItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'multiplierCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Line Item',
        field: 'invoiceLineItem',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'multiplierCharges',
            required: true
          },
          change: (param, value) => this.dropdownValueChanged(param, value)
        }
      },
      {
        headerName: 'Multiplier',
        field: 'multiplier',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.numberInput
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.numberInput
        },
        valueFormatter: e => this.integerFormatter(e)
      },
      {
        headerName: 'Multiplier Value',
        field: 'value',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'multiselectCellRenderer',
        cellEditor: 'multiselectCellEditor',
        suppressKeyboardEvent: this.suppressEnter,
        editable: true,
        cellRendererParams: {
          data: {
            section: 'multiplierCharges'
          },
          change: (param, value) => {
            param.value = value;
          }
        }
      },
      {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: param => {
              this.multiplierRowData = this.getRowData('multiplierCharges').filter(
                (row, index) => index != param.rowIndex
              );
            },
            canDelete: true
          }
        }
      }
    ];
  }

  setGridOptions() {
    this.flatGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.flatColumnDefs,
      pagination: true,
      paginationPageSize: 4,
      enableColResize: true,
      rowHeight: 45,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true,
      singleClickEdit: true
    };
    this.variableGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.variableColumnDefs,
      pagination: true,
      paginationPageSize: 4,
      enableColResize: true,
      rowHeight: 45,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true,
      singleClickEdit: true
    };
    this.multiplierGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.multiplierColumnDefs,
      pagination: true,
      paginationPageSize: 4,
      enableColResize: true,
      rowHeight: 45,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true,
      singleClickEdit: true
    };
  }

  autoSizeColumns(event, section) {
    switch (section) {
      case 'flatCharges':
        this.flatGridOptions.api.sizeColumnsToFit();
        break;
      case 'variableCharges':
        this.variableGridOptions.api.sizeColumnsToFit();
        break;
      case 'multiplierCharges':
        this.multiplierGridOptions.api.sizeColumnsToFit();
        break;
      default:
        break;
    }
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
            this.isFormValid = false;
          } else {
            this.isFormValid = true;
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }

  dropdownValueChanged(param, value, edit = false) {
    const rowData = this.getRowData(param.data.section);

    // Exit all cells from the editing mode
    this.flatGridOptions.api.stopEditing(false);
    this.variableGridOptions.api.stopEditing(false);
    this.multiplierGridOptions.api.stopEditing(false);

    switch (param.colDef.field) {
      case 'invoiceItem':
        this.getRowData(param.data.section)[param.rowIndex].invoiceItem = value;
        if (rowData.length) {
          rowData[param.rowIndex].invoiceItem = value;
          if (param.data.section === 'flatCharges') {
            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(
              item => item.processPricingParameterGroup.name == 'flat_charges'
            );
            const invoiceLineItem = rowData[param.rowIndex].invoiceLineItem;

            if (!edit) {
              if (
                rowData[param.rowIndex].invoiceLineItemOptions.filter(option => option.id == invoiceLineItem).length ==
                0
              ) {
                rowData[param.rowIndex].invoiceLineItem = '';
              }

              const unitList = this.unitForMultiplier;
              this.multiplierRowData = this.getRowData('multiplierCharges').map(row => {
                const valueList = this.getValidRowValue(row, unitList);
                return {
                  ...row,
                  valueOptions: [...unitList],
                  value: valueList
                };
              });
            }

            this.flatRowData = [...rowData];
          }
          if (param.data.section === 'variableCharges') {
            const invoiceItem = rowData[param.rowIndex].invoiceItem;
            const invoiceLineItem = rowData[param.rowIndex].invoiceLineItem;
            const partValue = rowData[param.rowIndex].partValue;
            const unit = rowData[param.rowIndex].unit;

            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(
              item => item.processPricingParameterGroup.name == 'variable_charges'
            );

            const filter = rowData[param.rowIndex].invoiceLineItemOptions.filter(
              item => item.invoiceItem.id == invoiceItem
            );
            if (filter.length) {
              rowData[param.rowIndex].partValueOptions = filter[0].processPricingConditionTypeList;
            } else {
              rowData[param.rowIndex].partValueOptions = [];
            }

            const measurementTypeItem = rowData[param.rowIndex].partValueOptions.filter(
              option => option.id == partValue
            );
            if (measurementTypeItem.length) {
              const measurementType = measurementTypeItem[0].measurementType;

              rowData[param.rowIndex].unitOptions = this.units.filter(
                unitItem => unitItem.measurementType.id == measurementType.id
              );
            } else {
              rowData[param.rowIndex].unitOptions = [];
            }

            if (!edit) {
              if (
                rowData[param.rowIndex].invoiceLineItemOptions.filter(option => option.id == invoiceLineItem).length ==
                0
              ) {
                rowData[param.rowIndex].invoiceLineItem = '';
              }

              if (rowData[param.rowIndex].partValueOptions.filter(option => option.id == partValue).length == 0) {
                rowData[param.rowIndex].partValue = '';
              }

              if (rowData[param.rowIndex].unitOptions.filter(option => option.id == unit).length == 0) {
                rowData[param.rowIndex].unit = '';
              }
              // }
              // rowData[param.rowIndex].unitOptions = [];
              // if (!edit) {
              const unitList = this.unitForMultiplier;
              this.multiplierRowData = this.getRowData('multiplierCharges').map(row => {
                const valueList = this.getValidRowValue(row, unitList);
                return {
                  ...row,
                  valueOptions: [...unitList],
                  value: valueList
                };
              });
            }

            this.variableRowData = [...rowData];
          }
          if (param.data.section === 'multiplierCharges') {
            const invoiceLineItem = rowData[param.rowIndex].invoiceLineItem;
            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(
              item => item.processPricingParameterGroup.name == 'multipliers'
            );

            if (!edit) {
              if (
                rowData[param.rowIndex].invoiceLineItemOptions.filter(option => option.id == invoiceLineItem).length ==
                0
              ) {
                rowData[param.rowIndex].invoiceLineItem = '';
              }
            }

            this.multiplierRowData = [...rowData];
          }
        }
        break;
      case 'invoiceLineItem':
        this.getRowData(param.data.section)[param.rowIndex].invoiceLineItem = value;

        if (param.data.section === 'variableCharges') {
          const lineItem = rowData[param.rowIndex].invoiceLineItem;

          const invoiceItem = rowData[param.rowIndex].invoiceItem;
          const partValue = rowData[param.rowIndex].partValue;
          const unit = rowData[param.rowIndex].unit;

          const filter = rowData[param.rowIndex].invoiceLineItemOptions.filter(item => item.id == lineItem);
          if (filter.length) {
            rowData[param.rowIndex].partValueOptions = filter[0].processPricingConditionTypeList;
            // rowData[param.rowIndex].unitOptions = [];
          } else {
            rowData[param.rowIndex].partValueOptions = [];
          }
          const measurementTypeItem = rowData[param.rowIndex].partValueOptions.filter(option => option.id == partValue);
          if (measurementTypeItem.length) {
            const measurementType = measurementTypeItem[0].measurementType;

            rowData[param.rowIndex].unitOptions = this.units.filter(
              unitItem => unitItem.measurementType.id == measurementType.id
            );
          } else {
            rowData[param.rowIndex].unitOptions = [];
          }

          if (!edit) {
            if (rowData[param.rowIndex].partValueOptions.filter(option => option.id == partValue).length == 0) {
              rowData[param.rowIndex].partValue = '';
            }

            if (rowData[param.rowIndex].unitOptions.filter(option => option.id == unit).length == 0) {
              rowData[param.rowIndex].unit = '';
            }
          }

          this.variableRowData = [...rowData];
        }

        if (param.data.section != 'multiplierCharges') {
          const unitList = this.unitForMultiplier;
          this.multiplierRowData = this.getRowData('multiplierCharges').map(row => {
            const valueList = this.getValidRowValue(row, unitList);
            return { ...row, valueOptions: [...unitList], value: valueList };
          });
        }
        break;
      case 'unit':
        this.getRowData(param.data.section)[param.rowIndex].unit = value;
        break;
      case 'partValue':
        this.getRowData(param.data.section)[param.rowIndex].partValue = value;
        if (param.data.section === 'variableCharges') {
          const partValueOptions = rowData[param.rowIndex].partValueOptions;
          const partValue = rowData[param.rowIndex].partValue;
          const unit = rowData[param.rowIndex].unit;

          const measurementTypeItem = partValueOptions.filter(option => option.id == partValue);
          if (measurementTypeItem.length) {
            const measurementType = measurementTypeItem[0].measurementType;

            rowData[param.rowIndex].unitOptions = this.units.filter(
              unitItem => unitItem.measurementType.id == measurementType.id
            );
          } else {
            rowData[param.rowIndex].unitOptions = [];
          }

          if (!edit) {
            if (rowData[param.rowIndex].unitOptions.filter(option => option.id == unit).length == 0) {
              rowData[param.rowIndex].unit = '';
            }
          }

          this.variableRowData = [...rowData];
        }
        break;
      case 'multiplier':
        this.getRowData(param.data.section)[param.rowIndex].multiplier = value;
        break;
      case 'value':
        this.getRowData(param.data.section)[param.rowIndex].value = value;
        break;
      case 'multiplierValueRefresh':
        const unitList = this.unitForMultiplier;
        this.multiplierRowData = this.getRowData('multiplierCharges').map(row => {
          const valueList = this.getValidRowValue(row, unitList);
          return { ...row, valueOptions: [...unitList], value: valueList };
        });
        break;
      default:
        break;
    }
  }

  getValidRowValue(row: any, unitList: any[]) {
    const valueList = [];
    const unitListId = unitList.map(unit => unit.id);

    if (Array.isArray(row.value)) {
      row.value.map(v => {
        if (unitListId.includes(v)) {
          valueList.push(v);
        }
      });
    } else {
      if (unitListId.includes(row.value)) {
        valueList.push(row.value);
      }
    }
    return valueList;
  }

  getContextInvoiceLineItemOptions(param, value) {
    let result = [];
    const rowData = this.getRowData(param.data.section);
    const invoiceId = rowData[param.rowIndex].invoiceItem;
    switch (param.data.section) {
      case 'flatCharges':
        // tslint:disable-next-line:max-line-length
        result = this.flatConditions.invoiceLineItems.filter(item => item.invoiceItem.id == invoiceId);
        break;
      case 'variableCharges':
        // tslint:disable-next-line:max-line-length
        result = this.variableConditions.invoiceLineItems.filter(item => item.invoiceItem.id == invoiceId);
        break;
      case 'multiplierCharges':
        // tslint:disable-next-line:max-line-length
        result = this.multiplierConditions.invoiceLineItems.filter(item => item.invoiceItem.id == invoiceId);
        break;

      default:
        break;
    }
    return result;
  }

  getRowData(section) {
    const rowData = [];
    switch (section) {
      case 'flatCharges':
        this.flatGridOptions.api.forEachNode(node => rowData.push(node.data));
        break;
      case 'variableCharges':
        this.variableGridOptions.api.forEachNode(node => rowData.push(node.data));
        break;
      case 'multiplierCharges':
        this.multiplierGridOptions.api.forEachNode(node => rowData.push(node.data));

        break;
      default:
        break;
    }
    return rowData;
  }

  // READ: https://www.ag-grid.com/javascript-grid-data-update/#adding-rows
  addCondition(section, data?) {
    switch (section) {
      case 'flatCharges':
        this.flatGridOptions.api.updateRowData({
          add: [
            {
              invoiceItem: data ? data.invoiceLineItem.invoiceItem.id : '',
              invoiceLineItem: data ? data.invoiceLineItem.id : '',
              value: data ? data.price : '',
              invoiceItemOptions: this.flatConditions.invoiceItem,
              // invoiceLineItemOptions: this.flatConditions.invoiceLineItems
              invoiceLineItemOptions: []
            }
          ]
        });
        this.dropdownValueChanged(
          {
            colDef: {
              field: 'multiplierValueRefresh'
            },
            data: {
              section: 'multiplierCharges'
            }
          },
          ''
        );
        break;
      case 'variableCharges':
        let measurementType = '';
        if (data) {
          measurementType = data.processPricingConditionType.measurementType.id;
        }
        this.variableGridOptions.api.updateRowData({
          add: [
            {
              invoiceItem: data ? data.invoiceLineItem.invoiceItem.id : '',
              invoiceLineItem: data ? data.invoiceLineItem.id : '',
              value: data ? data.price : '',
              quantity: data ? data.quantity : '',
              unit: data ? data.quantityUnitType.id : '',
              partValue: data ? data.processPricingConditionType.id : '',
              invoiceItemOptions: this.variableConditions.invoiceItem,
              invoiceLineItemOptions: [],
              unitOptions: data ? this.units.filter(unit => unit.measurementType.id == measurementType) : [],
              partValueOptions: data ? data.invoiceLineItem.processPricingConditionTypeList : []
            }
          ]
        });
        this.dropdownValueChanged(
          {
            colDef: {
              field: 'multiplierValueRefresh'
            },
            data: {
              section: 'multiplierCharges'
            }
          },
          ''
        );
        break;
      case 'multiplierCharges':
        this.multiplierGridOptions.api.updateRowData({
          add: [
            {
              invoiceItem: data ? data.invoiceLineItem.invoiceItem.id : '',
              invoiceLineItem: data ? data.invoiceLineItem.id : '',
              // value: data ? data.price : '',
              multiplier: data ? data.multiplier : '',
              invoiceItemOptions: this.multiplierConditions.invoiceItem,
              value: data ? data.multiplierProcessPricingParameter.invoiceLineItem.id : '',
              // valueOptions: [
              //   ...this.variableConditions.invoiceLineItems,
              //   ...this.flatConditions.invoiceLineItems,
              //   // ...this.variableConditions.invoiceItem,
              //   // ...this.flatConditions.invoiceItem
              // ],
              valueOptions: [...this.unitForMultiplier],
              invoiceLineItemOptions: []
            }
          ]
        });
        this.dropdownValueChanged(
          {
            colDef: {
              field: 'multiplierValueRefresh'
            },
            data: {
              section: 'multiplierCharges'
            }
          },
          ''
        );
        break;

      default:
        break;
    }
  }

  get unitForMultiplier() {
    const flatData = this.getRowData('flatCharges');
    const variableData = this.getRowData('variableCharges');

    this.flatLineItem = [];
    this.variableLineItem = [];
    this.invoiceItems = [];

    const visitedFlatLineItem = [];
    const visitedVariableLineItem = [];
    const visitedInvoiceItem = [];

    flatData.map(item => {
      const res = item.invoiceLineItemOptions.filter(e => e.id == item.invoiceLineItem);
      res.map(r => {
        if (!visitedFlatLineItem.includes(r.name)) {
          visitedFlatLineItem.push(r.name);
          this.flatLineItem.push(r);
        }
        if (!visitedInvoiceItem.includes(r.invoiceItem.name)) {
          visitedInvoiceItem.push(r.invoiceItem.name);
          this.invoiceItems.push({
            ...r.invoiceItem,
            id: r.invoiceItem.id + 'invoiceItem'
          });
        }
      });
    });
    variableData.map(item => {
      const res = item.invoiceLineItemOptions.filter(e => e.id == item.invoiceLineItem);
      res.map(r => {
        if (!visitedVariableLineItem.includes(r.name)) {
          visitedVariableLineItem.push(r.name);
          this.variableLineItem.push(r);
        }
        if (!visitedInvoiceItem.includes(r.invoiceItem.name)) {
          visitedInvoiceItem.push(r.invoiceItem.name);
          this.invoiceItems.push({
            ...r.invoiceItem,
            id: r.invoiceItem.id + 'invoiceItem'
          });
        }
      });
    });
    let result = [...this.flatLineItem, ...this.variableLineItem, ...this.invoiceItems];
    if (result.length > 0) {
      result = [{ id: 'all-line-items', name: 'All line item' }, ...result];
    }

    return result;
  }

  addParameterCondition() {
    this.selectedPricingConditionList.push({
      operatorType: {
        id: ''
      },

      processPricingConditionType: {
        id: ''
      },
      unitType: {
        id: ''
      },
      value: '',
      valueInDefaultUnit: '',
      valueSignType: {
        id: ''
      },
      operandTypeList: [],
      units: []
    });
  }

  removeParameterCondition(index) {
    let frontSlice = [];
    let endSlice = [];
    if (this.selectedPricingConditionList.length !== 0) {
      frontSlice = this.selectedPricingConditionList.slice(0, index);
      endSlice = this.selectedPricingConditionList.slice(index + 1);
      this.selectedPricingConditionList = frontSlice.concat(endSlice);
    }
  }

  prepareData() {
    // const flatChargesId = this.pricingParameterGroup.filter(item => item.name === 'flat_charges');
    // const variableChargesId = this.pricingParameterGroup.filter(item => item.name === 'variable_charges');
    // const multiplierChargesId = this.pricingParameterGroup.filter(item => item.name === 'multipliers');
    this.gridHasInvalidInput = false;

    const flatCharges = this.getRowData('flatCharges').map(row => {
      if (!row.value || !row.invoiceLineItem) {
        this.gridHasInvalidInput = true;
      }
      return new Object({
        currency: {
          id: 1
        },

        price: row.value,
        invoiceLineItem: {
          id: row.invoiceLineItem
        }
      });
    });
    const variableCharges = this.getRowData('variableCharges').map(row => {
      if (!row.value || !row.invoiceLineItem || !row.quantity || !row.unit || !row.partValue) {
        this.gridHasInvalidInput = true;
      }
      return new Object({
        currency: {
          id: 1
        },
        price: row.value,
        invoiceLineItem: {
          id: row.invoiceLineItem
        },
        quantity: row.quantity,
        quantityUnitType: { id: row.unit },
        processPricingConditionType: { id: row.partValue }
      });
    });

    const multiplierCharges = [];
    this.getRowData('multiplierCharges').map(row => {
      let values = [];

      if (Array.isArray(row.value)) {
        values = row.value;
      } else {
        values = [row.value];
      }

      if (values.length === 1 && values[0] === 'all-line-items') {
        values = row.valueOptions.filter(val => val.id.toString().includes('invoiceItem')).map(i => i.id);
      }

      values.map(item => {
        const selectedValue = item;

        if (selectedValue.toString().includes('invoiceItem')) {
          row.valueOptions
            .filter(val => val.invoiceItem && val.invoiceItem.id + 'invoiceItem' == selectedValue)
            .map(v => {
              if (!row.invoiceLineItem || !row.multiplier) {
                this.gridHasInvalidInput = true;
              }
              multiplierCharges.push({
                invoiceLineItem: {
                  id: row.invoiceLineItem || ''
                },
                multiplier: row.multiplier || '',
                multiplierProcessPricingParameter: {
                  invoiceLineItem: {
                    id: v.id
                  }
                }
              });
            });
        } else {
          if (!row.invoiceLineItem || !row.multiplier) {
            this.gridHasInvalidInput = true;
          }
          multiplierCharges.push({
            invoiceLineItem: {
              id: row.invoiceLineItem
            },
            multiplier: row.multiplier,
            multiplierProcessPricingParameter: {
              invoiceLineItem: {
                id: selectedValue
              }
            }
          });
        }
      });
    });
    const postData = {
      id: this.form.value.id || '',
      name: this.form.value.pricingProfileName,
      processPricingConditionList: this.selectedPricingConditionList,
      processPricingParameterList: [...flatCharges, ...variableCharges, ...multiplierCharges],
      processProfile: { id: this.form.value.processProfileId },
      processProfileType: {
        id: 1
      }
    };
    return postData;
  }

  save(event) {
    event.preventDefault();
    // this.submitActive = false;
    this.prepareData();
    if (this.gridHasInvalidInput) {
      this.error = 'Unexpected error occured. Please check your inputs.';
      return;
    }
    setTimeout(async () => {
      if (this.form.valid && this.isFormValid) {
        this.error = '';
        const vendorId = this.vendorId;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            const newProfile = await this.processPricingService.saveProfile(vendorId, postData).toPromise();
            if (this.saveToAssociate) {
              this.toaster.success('Process Pricing Created!');
              this.associatePricingProfile(newProfile);
              return;
            }
            if (this.defaultProcessProfileId) {
              const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
              this.route.navigateByUrl(
                `${gotoURL.substr(0, gotoURL.lastIndexOf('/'))}/profile/edit/${this.defaultProcessProfileId}`
              );
            } else if (this.bidOrder || this.productionProjectId) {
              localStorage.removeItem('pricing-return');
              this.route.navigateByUrl(this.fallbackUrl);
            } else {
              const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
              this.route.navigateByUrl(gotoURL, {
                state: {
                  toast: { type: 'success', body: 'Process Pricing Created!' }
                }
              });
            }
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              // this.error = e.error.message;
              this.error = 'Please check your inputs';
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
          }
        } else {
          this.spinner.show();
          try {
            const newProfile = await this.processPricingService
              .updateProfile(vendorId, this.processPricingId, postData)
              .toPromise();
            if (this.saveToAssociate) {
              this.toaster.success('Process Pricing Edited!');
              this.associatePricingProfile(newProfile);
              return;
            }
            if (!this.bidOrder && !this.productionProjectId) {
              const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
              this.route.navigateByUrl(gotoURL, {
                state: {
                  toast: { type: 'success', body: 'Process Pricing Edited!' }
                }
              });
            }
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              // this.error = e.error.message;
              this.error = 'Please check your inputs';
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
            // this.submitActive = true;
          }
        }
      } else {
        // this.submitActive = true;
      }
    }, 100);
  }

  async onSaveAndCreateAnother(event) {
    event.preventDefault();

    // this.submitActive = false;
    setTimeout(async () => {
      if (this.form.valid) {
        this.error = '';
        const vendorId = this.vendorId;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            const serverData = await this.processPricingService.saveProfile(vendorId, postData).toPromise();
            this.processPricingService.storeCloneData(serverData);
            const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
            this.route.navigateByUrl(`${gotoURL}/clone`);
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              // this.error = e.error.message;
              this.error = 'Please check your inputs';
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
          }
        } else {
          this.spinner.show();
          try {
            const serverData = await this.processPricingService
              .updateProfile(vendorId, this.processPricingId, postData)
              .toPromise();
            this.processPricingService.storeCloneData(serverData);
            const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
            this.route.navigateByUrl(`${gotoURL}/clone`, {
              state: {
                toast: { type: 'success', body: 'Process Profile Created!' }
              }
            });
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              // this.error = e.error.message;
              this.error = 'Please check your inputs';
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
            // this.submitActive = true;
          }
        }
      } else {
        // this.submitActive = true;
      }
    }, 100);
  }

  getRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  canConfirmAssociation() {
    return JSON.stringify(this.selectedProfilesForAssociating) === '{}';
  }

  associatePricingProfile(newPricingProfile) {
    this.modalService.dismissAll();
    this.spinner.hide();
    if (newPricingProfile != null) {
      this.selectedPricingProfile = newPricingProfile;
      this.selectedProfilesForAssociating = {};
      this.modalService.open(this.associatePricingProfiles, {
        size: 'lg',
        centered: true
      });
    } else {
      // this.toaster.error('Error While Saving Pricing Profile');
    }
  }

  isProfileChecked(profileId: string) {
    if (this.selectedPricingProfile.processProfile.id != profileId) {
      return Object.keys(this.selectedProfilesForAssociating).includes(profileId.toString());
    }
    return true;
  }

  toggleProfileSelection(profile: ProcessProfile, check: boolean) {
    if (this.selectedPricingProfile.processProfile.id != profile.id) {
      if (check) {
        this.selectedProfilesForAssociating[profile.id.toString()] = profile;
      } else {
        delete this.selectedProfilesForAssociating[profile.id.toString()];
      }
    }
  }

  confirmAssociatingProfile() {
    this.spinner.show();
    const saveCalls = Object.keys(this.selectedProfilesForAssociating).map(item => {
      const postData: PricingProfile = {
        ...this.selectedPricingProfile,
        processProfile: this.selectedProfilesForAssociating[item]
      };
      return this.processPricingService.saveProfile(this.vendorId, postData);
    });

    forkJoin(saveCalls).subscribe(
      async data => {
        this.toaster.success('Associated Profiles Successfully');
        this.modalService.dismissAll();
        this.spinner.hide();

        this.saveToAssociate = false;
        this.selectedPricingProfile = null;
        this.selectedProfilesForAssociating = {};

        const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
        this.route.navigateByUrl(gotoURL);
      },
      err => {
        console.error({ err });

        this.toaster.error('Error While Associating Profiles');
        this.modalService.dismissAll();
        this.spinner.hide();

        this.saveToAssociate = false;
        this.selectedPricingProfile = null;
        this.selectedProfilesForAssociating = {};

        const gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/pricing')) + '/pricing';
        this.route.navigateByUrl(gotoURL);
      }
    );
  }

  getPricingFullName(pricingProfile) {
    const profile = pricingProfile;
    return `${profile && profile.processProfile && profile.processProfile.name} : ${profile.name}`;
  }
  suppressEnter(params) {
    const KEY_ENTER = 13;
    const event = params.event;
    const key = event.which;
    const suppress = key === KEY_ENTER;
    return suppress;
  }
}
