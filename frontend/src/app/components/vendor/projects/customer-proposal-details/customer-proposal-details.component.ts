import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InsightPartInformationComponent } from 'src/app/components/vendor/insight/insight-part-information/insight-part-information.component';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { UserService } from 'src/app/service/user.service';
import { CustomerService } from 'src/app/service/customer.service';
import { MetadataService } from 'src/app/service/metadata.service';
import { combineLatest, of, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PartService } from 'src/app/service/part.service';
import { PartQuote, Part } from '../../../../model/part.model';
import { OrdersService } from 'src/app/service/orders.service';
import { FilterOption } from 'src/app/model/vendor.model';
@Component({
  selector: 'app-customer-proposal-details',
  templateUrl: './customer-proposal-details.component.html',
  styleUrls: ['./customer-proposal-details.component.css']
})
export class CustomerProposalDetailsComponent extends InsightPartInformationComponent implements OnInit {
  @Input() partIds;
  hideCloseButton = true;
  public selectedSubTabId$: BehaviorSubject<number> = new BehaviorSubject(0);
  public isShowingGlobalRuleProfile$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  parts: Part[];
  part: Part;
  partId: number;
  partQuote: PartQuote;
  processProfiles: any[] = null;
  pricingProfiles: any[] = null;

  subTabs = [
    {
      title: 'Requirements',
      id: 0
    },
    {
      title: 'Quote',
      id: 1
    },
    {
      title: 'Related Process Profiles',
      id: 2
    },
    {
      title: 'Related Pricing Profiles',
      id: 3
    }
  ];

  constructor(
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    public toastr: ToastrService,
    protected customerService: CustomerService,
    protected spinner: NgxSpinnerService,
    public metadataService: MetadataService,
    public partService: PartService,
    protected ordersService: OrdersService
  ) {
    super(pricingService, userService, customerService, spinner, metadataService);
    this.selectedSubTabId$.subscribe(async v => {
      if (this.selected$) {
        this.selected$.subscribe(async part => {
          this.part = part;
          if (v == 1) {
            this.getQuoteInfoByPartId(part.id);
          } else if (v == 2) {
            this.getProcessProfile();
          } else if (v == 3) {
            this.getPricingProfiles();
          }
        });
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.geAllPartsByIds();
  }
  geAllPartsByIds() {
    this.spinner.show();
    combineLatest((this.partIds || []).map(id => this.partService.getPartByPartId(id)))
      .pipe(catchError(err => of([])))
      .subscribe(
        (parts: any) => {
          this.parts = parts;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
  }

  getQuoteInfoByPartId(partId) {
    this.pricingService.getPartQuote(partId).subscribe(
      partQuote => {
        this.partQuote = partQuote;
      },
      error => {
        this.toastr.error('Error while Removing Project From Release');
      }
    );
  }

  async getProcessProfile(applyGlobalRule = false) {
    this.spinner.show();
    const res = await this.ordersService
      .getMatchingProcessProfiles([this.part.rfqMedia.id], applyGlobalRule)
      .toPromise();

    this.processProfiles = [];
    this.processProfiles = res.map(item => ({
      id: item.processProfileId,
      profileId: item.processProfileId,
      vendorName: item.corporateName,
      processProfileName: item.processProfileName,
      facilityName: item.facilityName,
      material: item.material,
      equipment: item.equipment
    }));
    this.spinner.hide();
  }

  async getPricingProfiles(q = null) {
    this.spinner.show();
    try {
      const pageSize = 1000;
      let data = [];
      let page = 0;
      let filter: FilterOption = { size: pageSize, sort: '', page, q: '' };

      let currentData = await this.pricingService
        .getScreenPricingProfileByPartId(
          this.part.id,
          this.processProfiles.map(profile => profile.profileId),
          filter
        )
        .toPromise();
      while (currentData.length) {
        page = page + 1;
        data = data.concat(currentData);
        filter = { size: pageSize, sort: '', page, q: '' };
        if (currentData.length == pageSize) {
          currentData = await this.pricingService
            .getScreenPricingProfileByPartId(
              this.part.id,
              this.processProfiles.map(profile => profile.profileId),
              filter
            )
            .toPromise();
        } else {
          currentData = [];
        }
      }
      this.pricingProfiles = data.map(item => ({
        selected: false,
        id: item.processPricingId,
        vendorName: item.processVendorName,
        pricingProfile: item.pricingProfileName,
        material: item.material,
        equipment: item.equipment,
        processProfile: item.processProfileName,
        totalCost: null
      }));
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.pricingProfiles = [];
    }
  }
}
