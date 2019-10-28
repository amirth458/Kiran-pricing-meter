import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { PricingMetadataService } from 'src/app/service/pricing-metadata.service';
import { GridOptions } from 'ag-grid-community';
import { DropdownCellRendererComponent } from 'src/app/common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { MultiSelectCellRendererComponent } from 'src/app/common/multi-select-cell-renderer/multi-select-cell-renderer.component';
import { MultiSelectCellEditorComponent } from 'src/app/common/multi-select-cell-editor/multi-select-cell-editor.component';

import { PostProcessPricingService } from 'src/app/service/post-process-pricing.service';
import { PostProcessProfileService } from 'src/app/service/post-process-profile.service';

@Component({
  selector: 'app-post-process-pricing-item',
  templateUrl: './post-process-pricing-item.component.html',
  styleUrls: ['./post-process-pricing-item.component.css']
})
export class PostProcessPricingItemComponent implements OnInit, AfterViewChecked {

  form: FormGroup = this.fb.group({
    id: '',
    pricingProfileName: [null],
    processProfileId: ['', Validators.required],
    processPricingConditionList: [[]],
    processPricingParameterList: [[]]
  });

  processPricingId = null;

  pricingParameterGroup = [];
  processProfiles = [];
  units = [];
  signTypes = [];

  conditions = [];
  filteredPricingConditionTypes = [];
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


  frameworkComponents = {
    multiselectCellRenderer: MultiSelectCellRendererComponent,
    multiselectCellEditor: MultiSelectCellEditorComponent,
    dropdownCellRenderer: DropdownCellRendererComponent,
    actionCellRenderer: ActionCellRendererComponent
  };

  flatColumnDefs: Array<any> = [];
  variableColumnDefs: Array<any> = [];
  multiplierColumnDefs: Array<any> = [];


  flatLineItem = [];
  variableLineItem = [];

  invoiceItems = [];

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaDataService: ProcessMetadataService,
    public pricingMetaDataService: PricingMetadataService,
    public processProfileService: PostProcessProfileService,
    public processPricingService: PostProcessPricingService,
    public spinner: NgxSpinnerService,
    public userService: UserService
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();

      this.processProfiles = await this.processProfileService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();

      const signType = await this.processMetaDataService.getValueSignType(true).toPromise();
      const units = await this.processMetaDataService.getMeasurementUnitType(true).toPromise();
      const conditionTypes = await this.pricingMetaDataService.getConditionTypes(true).toPromise();
      const conditionParameters = await this.pricingMetaDataService.getConditionParameters(true).toPromise();
      // const pricingParameterGroup = await this.pricingMetaDataService.getParameterGroup().toPromise();
      // const conditionParameters = await this.pricingMetaDataService.getConditionParameters().toPromise();
      // const invoiceItems = await this.pricingMetaDataService.getInvoiceItems(true).toPromise();
      const invoiceLineItems = await this.pricingMetaDataService.getInvoiceLineItems(true).toPromise();

      // this.conditionTypes = conditionTypes.metadataList;
      // this.conditionParameters = conditionParameters.metadataList;

      const operatorType = await this.processMetaDataService.getoperatorType(true).toPromise();
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
        const identifier = JSON.stringify(JSON.stringify(item.invoiceItem) + JSON.stringify(item.processPricingParameterGroup));
        if (!visitedInvoiceItems.includes(identifier)) {
          visitedInvoiceItems.push(identifier);
          invoiceItems.push({ ...item.invoiceItem, processPricingParameterGroup: item.processPricingParameterGroup });
        }
      });

      this.flatConditions.invoiceItem = invoiceItems.filter(item => item.processPricingParameterGroup.name === 'flat_charges');
      this.variableConditions.invoiceItem = invoiceItems.filter(item => item.processPricingParameterGroup.name === 'variable_charges');
      this.multiplierConditions.invoiceItem = invoiceItems.filter(item => item.processPricingParameterGroup.name === 'multipliers');

      this.flatConditions.invoiceLineItems = invoiceLineItems.metadataList
        .filter(item => item.processPricingParameterGroup.name === 'flat_charges');
      this.variableConditions.invoiceLineItems = invoiceLineItems.metadataList
        .filter(item => item.processPricingParameterGroup.name === 'variable_charges');
      this.multiplierConditions.invoiceLineItems = invoiceLineItems.metadataList
        .filter(item => item.processPricingParameterGroup.name === 'multipliers');

      this.conditionParameters = conditionParameters.metadataList;

      this.variableConditions.conditionTypes = [];
      this.variableConditions.unit = units.metadataList;

      this.conditionTypes = conditionTypes.metadataList;
      this.filteredPricingConditionTypes = this.conditionTypes;
      this.units = units.metadataList;
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
        // Make API request
        this.isNew = false;
        this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        // tslint:disable-next-line:max-line-length
        const processProfile = await this.processPricingService.getProfile(this.userService.getVendorInfo().id, this.processPricingId).toPromise();
        this.initForm(processProfile);
        this.processProfileChanged();








      }
      this.spinner.hide();
    }

    if (this.route.url.includes('clone')) {
      this.isNew = true;
      // tslint:disable-next-line:max-line-length
      const postProcessPrice = this.processPricingService.getCloneData();
      // processProfile.id = 0;
      setTimeout(() => {
        this.initForm(postProcessPrice);
        this.processProfileChanged();
      }, 100);
      this.spinner.hide();
    }
  }

  get name() {
    return this.form.value.pricingProfileName;
  }

  get profileName() {
    let name = '';
    if (this.form.value.processProfileId) {
      const profile = this.processProfiles.filter(p => p.id == this.form.value.processProfileId);
      name = profile.length ? profile[0].name : '';
    }
    return name;
  }

  get parameterDetails() {
    let name = '';
    this.selectedPricingConditionList.map(row => {
      if (
        row.operatorType.id &&
        row.processPricingConditionType.id &&
        row.unitType.id &&
        row.value
      ) {
        const parameter = this.conditionTypes.filter(item => item.id == row.processPricingConditionType.id)[0];
        const parameterName = parameter.name;
        const operator = row.operandTypeList.filter(operand => operand.id == row.operatorType.id)[0];
        const unit = row.units.filter(unitItem => unitItem.id == row.unitType.id)[0];
        if (parameter && unit && operator) {
          const operatorSymbol = operator.symbol;

          if (name.length > 1) {
            if (operatorSymbol == '=') {
              name += ', ' + row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += ', ' + operatorSymbol + ' ' + + row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          } else {
            if (operatorSymbol == '=') {
              name += row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += operatorSymbol + ' ' + + row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          }
        }

      }
    });
    return name;
  }

  onPropertyChange(conditionId, index) {
    let signTypeId = null;

    const operand = this.conditionTypes.filter(condition => condition.id == conditionId)[0];
    const operandTypeName = operand ? operand.operandType.name : null;
    const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
    this.selectedPricingConditionList[index].operandTypeList = options;
    // tslint:disable-next-line:max-line-length
    this.selectedPricingConditionList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];
    // tslint:disable-next-line:max-line-length
    const isSelectedUnitValid = this.selectedPricingConditionList[index].units.filter(u => u.id == this.selectedPricingConditionList[index].unitType.id).length > 0;
    if (!isSelectedUnitValid) {
      this.selectedPricingConditionList[index].unitType.id = '';
    }

    if (operandTypeName == 'absolute') {
      signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
    } else {
      signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
    }
    this.selectedPricingConditionList[index].valueSignType = {
      id: signTypeId
    };


  }

  processProfileChanged() {
    const selectedProcessProfile = this.processProfiles.filter(profile => profile.id == this.form.value.processProfileId)[0];
    // tslint:disable-next-line:max-line-length
    const processTypeId = selectedProcessProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.processFamily.processType.id;
    this.variableConditions.conditionTypes = this.conditionParameters.filter(param => param.processType.id == processTypeId);
    const temp = this.getRowData('variableCharges').map(row => new Object({
      ...row
    }));
    this.variableRowData = temp;
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
      processPricingParameterList: pricingProfile.processPricingParameterList,
    });
    this.selectedPricingConditionList = [];
    pricingProfile.processPricingConditionList.map((condition, index) => {
      this.selectedPricingConditionList.push({
        ...condition, operandTypeList: [],
        units: []
      });
      this.onPropertyChange(condition.processPricingConditionType.id, index);
    });

    pricingProfile.processPricingParameterList.map((parameter, index) => {
      let section = '';
      if (parameter.currency && parameter.currency.id && parameter.price) {
        section = 'flatCharges';
      }
      if (parameter.currency &&
        parameter.currency.id &&
        parameter.price &&
        parameter.quantity &&
        parameter.quantityUnitType &&
        parameter.quantityUnitType.id &&
        parameter.processPricingConditionType &&
        parameter.processPricingConditionType.id) {
        section = 'variableCharges';
      }
      if (parameter.currency.id &&
        parameter.multiplier &&
        parameter.multiplierProcessPricingParameter &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem.id) {
        section = 'multiplierCharges';
      }

      if (section === 'flatCharges') {
        this.addCondition('flatCharges', parameter);
        this.dropdownValueChanged({
          colDef: { field: 'invoiceItem' },
          data: {
            section: 'flatCharges'
          },
          rowIndex: flatChargesFound
        }, parameter.invoiceLineItem.invoiceItem.id, true);
        flatChargesFound++;
      }
      if (section === 'variableCharges') {
        this.addCondition('variableCharges', parameter);
        this.dropdownValueChanged({
          colDef: { field: 'invoiceItem' },
          data: {
            section: 'variableCharges'
          },
          rowIndex: variableChargesFound
        }, parameter.invoiceLineItem.invoiceItem.id, true);

        this.dropdownValueChanged({
          colDef: { field: 'invoiceLineItem' },
          data: {
            section: 'variableCharges'
          },
          rowIndex: variableChargesFound
        }, parameter.invoiceLineItem.id, true);

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
      //   }, parameter.invoiceLineItem.invoiceItem.id);
      //   multiplierChargesFound++;
      // }
    });

    pricingProfile.processPricingParameterList.map((parameter, index) => {
      let section = '';

      if (parameter.currency.id &&
        parameter.multiplier &&
        parameter.multiplierProcessPricingParameter &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem &&
        parameter.multiplierProcessPricingParameter.invoiceLineItem.id) {
        section = 'multiplierCharges';
      }

      if (section === 'multiplierCharges') {
        this.addCondition('multiplierCharges', parameter);
        this.dropdownValueChanged({
          colDef: { field: 'invoiceItem' },
          data: {
            section: 'multiplierCharges'
          },
          rowIndex: multiplierChargesFound
        }, parameter.invoiceLineItem.invoiceItem.id, true);

        this.dropdownValueChanged({
          colDef: { field: 'invoiceLineItem' },
          data: {
            section: 'multiplierCharges'
          },
          rowIndex: multiplierChargesFound
        }, parameter.invoiceLineItem.id, true);


        multiplierChargesFound++;
      }
    });
  }

  setColumnDefs() {
    this.flatColumnDefs = [
      {
        headerName: 'Invoice Item', field: 'invoiceItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'flatCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      {
        headerName: 'Line Item', field: 'invoiceLineItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'flatCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      { headerName: 'Value ($)', field: 'value', hide: false, sortable: false, filter: false, editable: true },
      {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: (param) => {
              this.flatRowData = this.getRowData('flatCharges').filter((row, index) => index != param.rowIndex);
            },
            canDelete: true,
          }
        }
      }
    ];

    this.variableColumnDefs = [
      {
        headerName: 'Invoice Item', field: 'invoiceItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      {
        headerName: 'Line Item', field: 'invoiceLineItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      { headerName: 'Value ($)', field: 'value', hide: false, sortable: false, filter: false, editable: true },
      // { headerName: 'Per', field: 'per', hide: false, sortable: false, filter: false, editable: false, width: 60 },
      { headerName: 'Per', field: 'quantity', hide: false, sortable: false, filter: false, editable: true },
      {
        headerName: 'Part Value', field: 'partValue', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      {
        headerName: 'Units', field: 'unit', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'variableCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      }, {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: (param) => {
              this.variableRowData = this.getRowData('variableCharges').filter((row, index) => index != param.rowIndex);
            },
            canDelete: true,
          }
        }
      }
    ];

    this.multiplierColumnDefs = [
      {
        headerName: 'Invoice Item', field: 'invoiceItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'multiplierCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      {
        headerName: 'Line Item', field: 'invoiceLineItem', hide: false, sortable: false, filter: false,
        cellRenderer: 'dropdownCellRenderer',
        cellRendererParams: {
          data: {
            section: 'multiplierCharges',
          },
          change: (param, value) => this.dropdownValueChanged(param, value),
        }
      },
      { headerName: 'Multiplier', field: 'multiplier', hide: false, sortable: false, filter: false, editable: true },
      {
        headerName: 'Multiplier Value', field: 'value', hide: false, sortable: false, filter: false,
        cellRenderer: 'multiselectCellRenderer',
        cellEditor: 'multiselectCellEditor',
        suppressKeyboardEvent: this.suppressEnter,
        editable: true,
        cellRendererParams: {
          data: {
            section: 'multiplierCharges',
          },
          change: (param, value) => {
            param.value = value;
          },
        }
      },
      {
        headerName: '',
        width: 40,
        cellRenderer: 'actionCellRenderer',
        cellRendererParams: {
          action: {
            delete: (param) => {
              this.multiplierRowData = this.getRowData('multiplierCharges').filter((row, index) => index != param.rowIndex);
            },
            canDelete: true,
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
      paginationPageSize: 5,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true,
    };
    this.variableGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.variableColumnDefs,
      pagination: true,
      paginationPageSize: 5,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true
    };
    this.multiplierGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.multiplierColumnDefs,
      pagination: true,
      paginationPageSize: 5,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      stopEditingWhenGridLosesFocus: true
    };

  }

  autoSizeColumns(section) {
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
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          this.isFormValid = false;
        } else {
          this.isFormValid = true;
        }
        form.classList.add('was-validated');
      }, false);
    });
  }


  dropdownValueChanged(param, value, edit = false) {
    const rowData = this.getRowData(param.data.section);
    switch (param.colDef.field) {
      case 'invoiceItem':
        this.getRowData(param.data.section)[param.rowIndex].invoiceItem = value;
        if (rowData.length) {
          rowData[param.rowIndex].invoiceItem = value;
          if (param.data.section === 'flatCharges') {
            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(item => item.processPricingParameterGroup.name == 'flat_charges');
            if (!edit) {
              this.multiplierRowData = this.getRowData('multiplierCharges').map(row => new Object(
                { ...row, valueOptions: [...this.unitForMultiplier] }
              ));
            }

            this.flatRowData = [...rowData];
          }
          if (param.data.section === 'variableCharges') {
            const invoiceItem = rowData[param.rowIndex].invoiceItem;
            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(item => item.processPricingParameterGroup.name == 'variable_charges');

            rowData[param.rowIndex].partValueOptions = rowData[param.rowIndex].invoiceLineItemOptions
              .filter(item => item.invoiceItem.id == invoiceItem)[0].processPricingConditionTypeList;
            // rowData[param.rowIndex].unitOptions = [];
            if (!edit) {

              this.multiplierRowData = this.getRowData('multiplierCharges').map(row => new Object(
                { ...row, valueOptions: [...this.unitForMultiplier] }
              ));
            }

            this.variableRowData = [...rowData];
          }
          if (param.data.section === 'multiplierCharges') {
            // tslint:disable-next-line:max-line-length
            rowData[param.rowIndex].invoiceLineItemOptions = this.getContextInvoiceLineItemOptions(param, value).filter(item => item.processPricingParameterGroup.name == 'multipliers');
            this.multiplierRowData = [...rowData];
          }
        }
        break;
      case 'invoiceLineItem':
        this.getRowData(param.data.section)[param.rowIndex].invoiceLineItem = value;

        if (param.data.section === 'variableCharges') {
          const lineItem = rowData[param.rowIndex].invoiceLineItem;

          rowData[param.rowIndex].partValueOptions = rowData[param.rowIndex].invoiceLineItemOptions
            .filter(item => item.id == lineItem)[0].processPricingConditionTypeList;
          // rowData[param.rowIndex].unitOptions = [];

          this.variableRowData = [...rowData];
        }

        if (param.data.section != 'multiplierCharges') {
          this.multiplierRowData = this.getRowData('multiplierCharges').map(row => new Object(
            { ...row, valueOptions: [...this.unitForMultiplier] }
          ));

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

          const measurementType = partValueOptions.filter(option => option.id == partValue)[0].measurementType;

          rowData[param.rowIndex].unitOptions = this.units.filter(unit => unit.measurementType.id == measurementType.id);

          this.variableRowData = [...rowData];
        }
        break;
      case 'multiplier':
        this.getRowData(param.data.section)[param.rowIndex].multiplier = value;
        break;
      case 'value':
        this.getRowData(param.data.section)[param.rowIndex].value = value;
        break;
      default:
        break;
    }
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
          add: [{
            invoiceItem: data ? data.invoiceLineItem.invoiceItem.id : '',
            invoiceLineItem: data ? data.invoiceLineItem.id : '',
            value: data ? data.price : '',
            invoiceItemOptions: this.flatConditions.invoiceItem,
            // invoiceLineItemOptions: this.flatConditions.invoiceLineItems
            invoiceLineItemOptions: [],
          }]
        });
        break;
      case 'variableCharges':
        let measurementType = '';
        if (data) {
          measurementType =
            data
              .processPricingConditionType
              .measurementType
              .id;
        }
        this.variableGridOptions.api.updateRowData({
          add: [{
            invoiceItem: data ? data.invoiceLineItem.invoiceItem.id : '',
            invoiceLineItem: data ? data.invoiceLineItem.id : '',
            value: data ? data.price : '',
            quantity: data ? data.quantity : '',
            unit: data ? data.quantityUnitType.id : '',
            partValue: data ? data.processPricingConditionType.id : '',
            invoiceItemOptions: this.variableConditions.invoiceItem,
            invoiceLineItemOptions: [],
            unitOptions: data ? this.units.filter(unit => unit.measurementType.id == measurementType) : [],
            partValueOptions: data ? data.invoiceLineItem.processPricingConditionTypeList : [],
          }]
        });
        break;
      case 'multiplierCharges':
        this.multiplierGridOptions.api.updateRowData({
          add: [{
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
            invoiceLineItemOptions: [],
          }]
        });
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
          this.invoiceItems.push({ ...r.invoiceItem, id: r.invoiceItem.id + 'invoiceItem' });
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
          this.invoiceItems.push({ ...r.invoiceItem, id: r.invoiceItem.id + 'invoiceItem' });
        }
      });
    });
    let result = [
      ...this.flatLineItem,
      ...this.variableLineItem,
      ...this.invoiceItems,
    ];
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
    if (this.selectedPricingConditionList.length !== 1) {
      frontSlice = this.selectedPricingConditionList.slice(0, index);
      endSlice = this.selectedPricingConditionList.slice(index + 1);
      this.selectedPricingConditionList = frontSlice.concat(endSlice);
    }

  }


  prepareData() {
    // const flatChargesId = this.pricingParameterGroup.filter(item => item.name === 'flat_charges');
    // const variableChargesId = this.pricingParameterGroup.filter(item => item.name === 'variable_charges');
    // const multiplierChargesId = this.pricingParameterGroup.filter(item => item.name === 'multipliers');

    const flatCharges = this.getRowData('flatCharges').map(row => new Object({
      currency: {
        id: 1
      },

      price: row.value,
      invoiceLineItem: {
        id: row.invoiceLineItem
      }
    }));
    const variableCharges = this.getRowData('variableCharges').map(row => new Object({
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
    }));

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
              multiplierCharges.push({
                invoiceLineItem: {
                  id: row.invoiceLineItem
                },
                multiplier: row.multiplier,
                multiplierProcessPricingParameter: {
                  invoiceLineItem: {
                    id: v.id
                  }
                }

              });
            });
        } else {
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
      name: this.form.value.pricingProfileName || 'Process Pricing - ' + this.getRandomString(7),
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
    setTimeout(async () => {
      if (this.form.valid && this.isFormValid) {
        this.error = '';
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            await this.processPricingService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/post-processes/pricing`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Pricing Created!!' } } });
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
            await this.processPricingService.updateProfile(vendorId, this.processPricingId, postData).toPromise();
            const gotoURL = `/profile/post-processes/pricing`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Pricing Edited!' } } });
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

  onSaveAndCreateAnother(event) {
    event.preventDefault();
    // this.submitActive = false;
    setTimeout(async () => {
      if (this.form.valid) {
        this.error = '';
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            const serverData = await this.processPricingService.saveProfile(vendorId, postData).toPromise();
            this.processPricingService.storeCloneData(serverData);
            this.route.navigateByUrl('/profile/post-processes/pricing/clone');
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
            const serverData = await this.processPricingService.updateProfile(vendorId, this.processPricingId, postData).toPromise();
            this.processPricingService.storeCloneData(serverData);
            this.route.navigateByUrl('/profile/post-processes/pricing/clone');
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

  suppressEnter(params) {
    const KEY_ENTER = 13;
    const event = params.event;
    const key = event.which;
    const suppress = key === KEY_ENTER;
    return suppress;
  }
}

