import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FileViewRendererComponent } from "../../../../../common/file-view-renderer/file-view-renderer.component";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Part } from "src/app/model/part.model";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";

@Component({
  selector: "app-price-view",
  templateUrl: "./price-view.component.html",
  styleUrls: ["./price-view.component.css"]
})
export class PriceViewComponent implements OnInit, OnChanges {
  @Input() part: Part;

  stage = "unset";

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [];
  gridOptions: GridOptions;
  partQuoteDetail;
  rowData = [];

  pricingForm: FormGroup = this.fb.group({
    toolingUnitCount: [1],
    toolingUnitPrice: [0],
    toolingExtended: [0],
    partsUnitCount: [30],
    partsUnitPrice: [50],
    partsExtended: [1500]
  });

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public pricingService: RfqPricingService,
    public toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.rowData = [
      {
        id: this.part && this.part.id,
        customer: "",
        rfq: this.part && this.part.rfqMedia.projectRfqId,
        part: this.part && this.part.rfqMedia.projectRfqId + "." + this.part.id,
        filename: this.part && this.part.rfqMedia.media.name,
        quantity: this.part && this.part.quantity,
        material: this.part && this.part.materialName,
        process: this.part && this.part.processTypeName,
        roughness: "",
        postProcess: "",
        price:
          this.part && this.part.shippingCost
            ? `$ ${this.part.shippingCost}`
            : ""
      }
    ];

    this.columnDefs = [
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
      {
        headerName: "Roughness",
        field: "roughness",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "Post-Process",
        field: "postProcess",
        hide: false,
        sortable: true,
        filter: true,
        cellClass: "text-center"
      },
      {
        headerName: "Price",
        field: "price",
        hide: false,
        sortable: true,
        cellClass: "text-center"
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  changeStage(newStage) {
    this.stage = newStage;
  }

  openModal(content, css) {
    this.modalService.open(content, {
      centered: true,
      windowClass: `${css}-modal`
    });
  }

  onSave() {
    this.modalService.dismissAll();
    this.stage = "set";

    const data = {
      expiredAt: "2019-12-17T18:43:53.729Z",
      id: 0,
      isManualPricing: true,
      matchedProfileIds: [0],
      partId: this.part.id,
      partQuoteDetailList: [
        {
          id: null,
          invoiceItemTypeName: "Tooling",
          partQuoteId: 1,
          unitCount: this.pricingForm.value.toolingUnitCount,
          unitPrice: this.pricingForm.value.toolingUnitPrice,
          extendedPrice: this.pricingForm.value.toolingExtended
        },
        {
          id: null,
          invoiceItemTypeName: "Parts",
          partQuoteId: 1,
          unitCount: this.pricingForm.value.partsUnitCount,
          unitPrice: this.pricingForm.value.partsUnitPrice,
          extendedPrice: this.pricingForm.value.partsExtended
        }
      ],
      pricingProfileId: null,
      quoteStatusTypeId: 1,
      totalCost:
        this.pricingForm.value.toolingExtended +
        this.pricingForm.value.partsExtended
    };

    this.pricingService
      .createPartQuoteDetail(data)
      .pipe(catchError(e => this.handleError(e)))
      .subscribe(() => {
        this.toastrService.success("Part Quote created successfully.");
      });
  }

  handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError("Error");
  }

  onRecommendModalClose(ev) {
    if (ev) {
      console.log(ev);
    }
    this.modalService.dismissAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.part && changes.part.currentValue) {
      console.log(this.part);
      this.partQuoteDetail = this.part.partQuoteList[0] || [];
      this.rowData = [
        {
          id: changes.part.currentValue.id,
          customer: "",
          rfq: changes.part.currentValue.rfqMedia.projectRfqId,
          part:
            changes.part.currentValue.rfqMedia.projectRfqId +
            "." +
            changes.part.currentValue.id,
          filename: changes.part.currentValue.rfqMedia.media.name,
          quantity: changes.part.currentValue.quantity,
          material: changes.part.currentValue.materialName,
          process: changes.part.currentValue.processTypeName,
          roughness: "",
          postProcess: "",
          price: changes.part.currentValue.shippingCost
            ? `$ ${changes.part.currentValue.shippingCost}`
            : ""
        }
      ];
    }
  }
}
