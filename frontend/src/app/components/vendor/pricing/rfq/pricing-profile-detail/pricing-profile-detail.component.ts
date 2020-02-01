import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { combineLatest } from 'rxjs';

import { CustomerData } from 'src/app/model/user.model';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { Part, RfqData, PartQuote, PricingProfileDetailedView } from '../../../../../model/part.model';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { PricingBreakDown, PricingBreakdown } from '../../../../../model/pricing.breakdown';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-pricing-profile-detail',
  templateUrl: './pricing-profile-detail.component.html',
  styleUrls: ['./pricing-profile-detail.component.css']
})
export class PricingProfileDetailComponent implements OnInit {
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [
    [
      {
        headerName: "Customer",
        field: "customer",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "RFQ",
        field: "rfq",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "Part",
        field: "part",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "File Name",
        field: "filename",
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: "fileViewRenderer"
      },
      {
        headerName: "Quantity",
        field: "quantity",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "Material",
        field: "material",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Process",
        field: "process",
        hide: false,
        sortable: true,
        filter: false
      },
      // {
      //   headerName: "Roughness",
      //   field: "roughness",
      //   hide: false,
      //   sortable: true,
      //   filter: false,
      //   cellClass: "text-center"
      // },
      // {
      //   headerName: "Post-Process",
      //   field: "postProcess",
      //   hide: false,
      //   sortable: true,
      //   filter: true,
      //   cellClass: "text-center"
      // },
      {
        headerName: "Price",
        field: "price",
        hide: false,
        sortable: true,
        cellClass: "text-center"
      }
    ],
    [
      {
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Value ($)",
        field: "value",
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Value ($)",
        field: "value",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Per",
        field: "per",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Part Value",
        field: "partValue",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Units",
        field: "units",
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Multiplier",
        field: "multiplier",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Multiplier Value",
        field: "multiplierValue",
        hide: false,
        sortable: true,
        filter: false
      }
    ]
  ];
  gridOptions = {
    partDetail: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[0],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    flatCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[1],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    variableCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[2],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    multiplierCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[3],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    }
  };
  rowData = [];
  flatRowData = [];
  variableRowData = [];
  multiplierRowData = [];
  pricingDetail;
  postProcesses;
  totalInvoice;

  part: Part;
  partQuote: PartQuote;
  rfq: RfqData;
  pricingProfile: PricingProfileDetailedView;
  customer: CustomerData;
  partId: any;
  profileId: any;

  breakDownGridOptions: Array<GridOptions>;
  breakDownColumnDefs = [];
  breakDownInfo: PricingBreakdown;

  constructor(
    private pricingService: RfqPricingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private currencyPipe: CurrencyPipe,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => {
      this.partId = params.partId;
      this.profileId = params.profileId;

      this.spinner.show();

      combineLatest(
        this.pricingService.getPartDetail(this.partId),
        this.pricingService.getPartQuote(this.partId)
      ).subscribe(([part, partQuote]) => {
        this.part = part;
        this.partQuote = partQuote;

        combineLatest(
          this.userService.getCustomer(this.part.rfqMedia.media.customerId),
          this.pricingService.getPricingProfileDetail([this.profileId]),
          this.pricingService.getProcessPricingDetail(this.profileId)
        ).subscribe(([customer, pricingProfiles, pricingDetail]) => {
          this.pricingProfile = pricingProfiles[0];
          this.pricingDetail = pricingDetail[0];
          this.customer = customer;
          this.updateData();
          this.spinner.hide();
        });
      });
    });
  }

  ngOnInit() {
    this.configureBreakDownColumns();
    this.breakDownGridOptions = [
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.breakDownColumnDefs[0],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        suppressHorizontalScroll: true
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.breakDownColumnDefs[1],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        suppressHorizontalScroll: true
      }
    ];
  }

  configureBreakDownColumns() {
    this.breakDownColumnDefs = [
      [
        {
          headerName: 'Invoice Item',
          field: 'invoiceItem',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Unit Price',
          field: 'unitPrice',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Total Invoice Item Cost',
          field: 'totalInvoiceItem',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: x => `$ ${x.value ? x.value.toLocaleString() : 0}`
        }
      ],
      [
        {
          headerName: 'Parameters Group',
          field: 'parameterGroup',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Invoice Item',
          field: 'invoiceItem',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Invoice Line Item',
          field: 'invoiceLineItem',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Item Cost',
          field: 'lineItemCost',
          hide: true,
          sortable: true,
          filter: false,
          valueFormatter: x => `$ ${x.value ? x.value.toLocaleString() : 0}`
        },
        {
          headerName: 'Multiplier',
          field: 'multiplier',
          hide: true,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Invoice Item Cost',
          field: 'finalInvoiceItemCost',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: x => `$ ${x.value ? x.value.toLocaleString() : 0}`
        }
      ]
    ];
  }

  onGridReady(ev, type) {
    this.gridOptions[type].api = ev.api;
    this.gridOptions[type].api.sizeColumnsToFit();
  }

  backButton() {
    this.router.navigateByUrl(
      this.router.url.substr(0, this.router.url.indexOf("/pricing-profile"))
    );
  }

  updateData() {
    if (!this.pricingProfile) {
      return;
    }
    this.rowData = [
      {
        id: this.part.id,
        customer: this.customer.name,
        rfq: this.part.rfqMedia.projectRfqId,
        part: this.part.rfqMedia.projectRfqId + "." + this.part.id,
        filename: this.part.rfqMedia.media.name,
        quantity: this.part.quantity,
        material: this.part.materialName,
        process: this.part.processTypeName,
        roughness: "",
        postProcess: "",
        price: this.partQuote
          ? this.currencyPipe.transform(
              this.partQuote.totalCost,
              "USD",
              "symbol",
              "0.0-3"
            )
          : this.part.partStatusType.displayName
      }
    ];

    this.pricingProfile.processPricingParameterList.forEach(param => {
      switch (param.invoiceLineItem.processPricingParameterGroup.name) {
        case "flat_charges":
          this.flatRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            value: param.price
          });
          break;
        case "multipliers":
          this.multiplierRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            multiplier: param.multiplier,
            multiplierValue:
              param.multiplierProcessPricingParameter.invoiceLineItem.name
          });
          break;
        case "variable_charges":
          this.variableRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            value: param.price,
            per: param.quantity,
            partValue: param.processPricingConditionType.name,
            units: param.quantityUnitType.name
          });
          break;
      }
    });
    this.flatRowData = [...this.flatRowData];
    this.multiplierRowData = [...this.multiplierRowData];
    this.variableRowData = [...this.variableRowData];

    const totalInvoice = {};

    this.pricingDetail.pricingProfileDetailedView.partPricingProfileViews.forEach(
      item => {
        const invoiceName =
          item.processPricingParameters.invoiceLineItem.invoiceItem.name;
        if (totalInvoice[invoiceName]) {
          totalInvoice[invoiceName].invoiceItemCost += parseInt(
            item.invoiceItemCost
          );
          totalInvoice[invoiceName].finalInvoiceItemCost += parseInt(
            item.finalInvoiceItemCost
          );
        } else {
          totalInvoice[invoiceName] = {
            invoiceItemCost: parseInt(item.invoiceItemCost),
            finalInvoiceItemCost: parseInt(item.finalInvoiceItemCost)
          };
        }
      }
    );

    this.totalInvoice = totalInvoice;
  }

  getPostProcess(id) {
    const found =
      this.part.postProcessTypeIds &&
      this.postProcesses.find(
        postProcess => postProcess.id == this.part.postProcessTypeIds[id]
      );
    return found && found.name;
  }

  showModal(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "pricing-view-modal"
    });
  }

  onBreakdownGridReady(idx, ev) {
    if(this.breakDownGridOptions[idx]) {
      this.breakDownGridOptions[idx].api = ev.api;
      this.breakDownGridOptions[idx].api.sizeColumnsToFit();
    }
  }

  viewBreakDownInfo(content) {
    this.spinner.show();
    this.pricingService.getScreenPricingBreakdown({
      partId: this.partId,
      processPricingId: this.pricingProfile.id
    } as PricingBreakDown).subscribe(v => {
      this.breakDownInfo = v;
      this.modalService.open(content, {
        centered: true,
        windowClass: 'break-down-modal'
      });
      if((this.breakDownInfo.costSummuryView || []).length > 0) {
        let cost = 0;
        this.breakDownInfo.costSummuryView.map(i => (cost += i.totalInvoiceItem));
        this.breakDownInfo.costSummuryView.push({
          invoiceItem: 'Total Cost',
          quantity: null,
          unitPrice: null,
          totalInvoiceItem: cost
        });
      }
      this.spinner.hide();
    });
  }

  finalInvoiceItemCost() {
    return this.pricingDetail.pricingProfileDetailedView.partPricingProfileViews.reduce(
      (sum, item) => sum + item.finalInvoiceItemCost,
      0
    );
  }

  get invoiceItemKeys() {
    return Object.keys(this.totalInvoice);
  }

  get pricingList() {
    return this.pricingDetail
      ? this.pricingDetail.pricingProfileDetailedView.partPricingProfileViews.sort(
          (a, b) => {
            const values = ["Flat Charge", "Variable", "Multiplier", null];
            return (
              values.findIndex(item => item === a.invoiceGroup) -
              values.findIndex(item => item === b.invoiceGroup)
            );
          }
        )
      : [];
  }
}
