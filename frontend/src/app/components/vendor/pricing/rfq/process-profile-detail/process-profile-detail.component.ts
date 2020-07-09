import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';

import { combineLatest } from 'rxjs';

import { CustomerData } from 'src/app/model/user.model';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { Part, RfqData, PartQuote, PricingProfileDetailedView, ProcessProfile } from '../../../../../model/part.model';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-process-profile-detail',
  templateUrl: './process-profile-detail.component.html',
  styleUrls: ['./process-profile-detail.component.css']
})
export class ProcessProfileDetailComponent implements OnInit {
  @ViewChild('viewPricingProfileCell') viewPricingProfileCell: TemplateRef<any>;
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent,
    templateRenderer: TemplateRendererComponent
  };
  columnDefs = [];
  gridOptions;
  rowData = [];
  selectedTab = 'dimension';
  pricingData = [];
  pricingProfiles: PricingProfileDetailedView[] = [];
  postProcesses;

  part: Part;
  partQuote: PartQuote;
  rfq: RfqData;
  processProfile: ProcessProfile;
  customer: CustomerData;
  partId: any;
  profileId: any;

  constructor(
    private pricingService: RfqPricingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.initColumnDefs();

    this.route.params.subscribe(params => {
      this.partId = params.partId;
      this.profileId = params.profileId;

      this.spinner.show();

      combineLatest(
        this.pricingService.getPartDetail(this.partId),
        this.pricingService.getPartQuote(this.partId),
        this.pricingService.getProcessProfileDetail([this.profileId])
      ).subscribe(([part, partQuote, processProfiles]) => {
        this.part = part;
        this.partQuote = partQuote;
        this.processProfile = processProfiles[0];

        combineLatest(
          this.userService.getCustomer(this.part.rfqMedia.media.customerId),
          this.pricingService.getPricingProfileDetail(this.processProfile.processPricingList.map(item => item.id))
        ).subscribe(([customer, pricingProfiles]) => {
          this.pricingProfiles = pricingProfiles;
          this.customer = customer;
          this.updateData();
          this.spinner.hide();
        });
      });
    });
  }

  onGridReady(ev, type) {
    this.gridOptions[type].api = ev.api;
    this.gridOptions[type].api.sizeColumnsToFit();
  }

  backButton() {
    this.router.navigateByUrl(this.router.url.substr(0, this.router.url.indexOf('/process-profile')));
  }

  initColumnDefs() {
    this.columnDefs = [
      [
        {
          headerName: 'Customer Name',
          field: 'customer',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'RFQ',
          field: 'rfq',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'Part',
          field: 'part',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'File Name',
          field: 'filename',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'fileViewRenderer'
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'Material',
          field: 'material',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Process',
          field: 'process',
          hide: false,
          sortable: true,
          filter: false
        },
        // {
        //   headerName: 'Roughness',
        //   field: 'roughness',
        //   hide: false,
        //   sortable: true,
        //   filter: false,
        //   cellClass: 'text-center'
        // },
        // {
        //   headerName: 'Post-Process',
        //   field: 'postProcess',
        //   hide: false,
        //   sortable: true,
        //   filter: true,
        //   cellClass: 'text-center'
        // },
        {
          headerName: 'Price',
          field: 'price',
          hide: false,
          sortable: true,
          cellClass: 'text-center'
        }
      ],
      [
        {
          headerName: 'Pricing No',
          field: 'pricingProfileId',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Pricing Profile',
          field: 'pricingProfileName',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Process Profile',
          field: 'processProfileName',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Parameter Set Nickname',
          field: 'parameterSetNickname',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Equipment',
          field: 'equipment',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Material',
          field: 'material',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , '),
          tooltip: param => (param.value || []).join(' , ')
        },
        {
          headerName: 'Pricing Condition 1',
          field: 'pricingCondition',
          hide: false,
          sortable: true,
          filter: false,
          tooltip: param => param.value
        },
        {
          headerName: 'Price',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.viewPricingProfileCell
          }
        }
      ]
    ];

    this.gridOptions = {
      partDetail: {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[0],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      },
      pricingProfile: {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[1],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      }
    };
  }

  updateData() {
    this.rowData = [
      {
        id: this.part.id,
        customer: this.customer.name,
        rfq: this.part.rfqMedia.projectRfqId,
        part: `${this.part.rfqMedia.projectRfqId}.${this.part.id}`,
        filename: this.part.rfqMedia.media.name,
        quantity: this.part.quantity,
        materialPropertyValues: this.part.materialPropertyValues,
        process: this.part.processTypeName,
        roughness: '',
        postProcess: '',
        price: this.partQuote
          ? this.currencyPipe.transform(this.partQuote.totalCost, 'USD', 'symbol', '0.0-3')
          : this.part.partStatusType.displayName
      }
    ];
    this.pricingData = this.processProfile.processPricingList.map(processPricing => {
      return {
        pricingProfileId: processPricing.id,
        pricingProfileName: processPricing.name,
        processProfileName: this.processProfile.name,
        parameterSetNickname: this.processProfile.parameterNickName,
        equipment: this.processProfile.processMachineServingMaterialList
          .map(item => item.machineServingMaterial.vendorMachinery.equipment.name)
          .join(', '),
        material: this.processProfile.processMachineServingMaterialList
          .map(item => item.machineServingMaterial.material.name)
          .join(', '),
        pricingCondition:
          processPricing.processPricingConditions[0] &&
          `${processPricing.processPricingConditions[0].processPricingConditionType.name} ${processPricing.processPricingConditions[0].operatorType.symbol}
            ${processPricing.processPricingConditions[0].valueSignType.symbol} ${processPricing.processPricingConditions[0].value}
            ${processPricing.processPricingConditions[0].unitType.displayName}`
      };
    });
  }

  showPricingProfile(pricingProfileId) {
    this.router.navigateByUrl(`/pricing/rfq/manual-price/${this.partId}/pricing-profile/${pricingProfileId}`);
  }

  getPostProcess(id) {
    const found =
      this.part.postProcessTypeIds &&
      this.postProcesses.find(postProcess => postProcess.id == this.part.postProcessTypeIds[id]);
    return found && found.name;
  }
}
