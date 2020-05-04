import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { CustomerData } from 'src/app/model/user.model';
import { Part } from 'src/app/model/part.model';
import { RfqData, PartQuote, PartDimension } from '../../../../../model/part.model';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { UserService } from 'src/app/service/user.service';
import { OrdersService } from 'src/app/service/orders.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { CustomerService } from 'src/app/service/customer.service';
import { CustomerDetails } from 'src/app/model/customer.model';

@Component({
  selector: 'app-price-detail',
  templateUrl: './price-detail.component.html',
  styleUrls: ['./price-detail.component.css']
})
export class PriceDetailComponent implements OnInit {
  public selectedId: number;
  public part: Part;
  public rfq: RfqData;
  public partQuote: PartQuote;
  public partDimension: PartDimension;
  public customer: CustomerDetails;
  public tabs = [];
  public selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);
  public isShowingGlobalRuleProfile$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  processProfiles: any[] = null;
  pricingProfiles: any[] = null;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    protected customerService: CustomerService,
    protected spinner: NgxSpinnerService,
    protected ordersService: OrdersService
  ) {
    this.route.params.subscribe(params => {
      this.selectedId = params.partId;
      this.getDetails(this.selectedId);
    });

    this.selectedTabId$.subscribe(async v => {
      if (v === 2 && this.processProfiles === null) {
        if (this.isShowingGlobalRuleProfile$.value) {
          // this.getGlobalRuleAppliedProcessProfile();
          this.getProcessProfile(true);
        } else {
          this.getProcessProfile(false);
        }
      }
      if (v === 3 && this.pricingProfiles === null) {
        if (this.processProfiles === null) {
          if (this.isShowingGlobalRuleProfile$.value) {
            // await this.getGlobalRuleAppliedProcessProfile();
            await this.getProcessProfile(true);
          } else {
            await this.getProcessProfile(false);
          }
        }

        if (this.processProfiles.length) {
          this.getPricingProfiles();
        } else {
          this.pricingProfiles = [];
        }
      }
    });

    this.isShowingGlobalRuleProfile$.subscribe(async v => {
      if (v) {
        if (this.selectedTabId$.value === 3) {
          // await this.getGlobalRuleAppliedProcessProfile();
          await this.getProcessProfile(true);
          this.getPricingProfiles();
        } else {
          // this.getGlobalRuleAppliedProcessProfile();
          this.getProcessProfile(true);
        }
      } else if (v === false && this.processProfiles != null) {
        if (this.selectedTabId$.value === 3) {
          await this.getProcessProfile(false);
          this.getPricingProfiles();
        } else {
          this.getProcessProfile(false);
        }
      }

      if (this.selectedTabId$.value === 2) {
        this.pricingProfiles = null;
      }
    });
  }

  public getDetails(id: number) {
    this.spinner.show();
    this.pricingService.getPartDetail(id).subscribe(part => {
      this.spinner.hide();
      this.part = part;
      this.pricingService.getRfqDetail(this.part.rfqMedia.projectRfqId).subscribe(rfq => {
        this.rfq = rfq;
      });
      this.customerService.getCustomerDetailsById(this.part.rfqMedia.media.customerId).subscribe(customer => {
        this.customer = customer;
      });
      this.pricingService.getPartQuote(this.part.id).subscribe(partQuote => {
        this.partQuote = partQuote;
      });
      this.pricingService.getPartDimension(this.part.id).subscribe(dimension => {
        this.partDimension = dimension;
      });
      this.setTabInfo();
    });
  }

  public setTabInfo() {
    this.tabs = [
      {
        id: 0,
        title: this.part && this.part.manualPricingAllowed ? 'Manual-Price View' : 'Auto-Price View'
      },
      {
        id: 1,
        title: 'Part Information'
      },
      {
        id: 2,
        title: 'Process Profile'
      },
      {
        id: 3,
        title: 'Pricing Profile'
      },
      this.part.manualPricingAllowed && {
        id: 4,
        title: 'Historical Bid'
      }
    ];
  }

  public manualQuote() {
    this.getDetails(this.selectedId);
  }

  ngOnInit() {}

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

  // Not being used
  async getGlobalRuleAppliedProcessProfile(q = null) {
    this.spinner.show();
    const res = await this.ordersService
      .getMatchedProfiles(this.userService.getUserInfo().id, [this.part.rfqMedia.id])
      .toPromise();

    this.processProfiles = [];
    this.processProfiles = res.map(item => ({
      id: item.processProfileView.id,
      profileId: item.processProfileId,
      vendorName: item.vendorProfile.name,
      processProfileName: item.processProfileView.name,
      facilityName:
        item.processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery
          .vendorFacility.name,
      pricingProfile: item.processPricingViews && item.processPricingViews.map(v => v.name).join(', '),
      material: this.getAllMaterials(item.processProfileView.processMachineServingMaterialList),
      equipment:
        item.processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment
          .name
    }));
    this.spinner.hide();
  }

  getAllMaterials(m: any) {
    const arr = [];
    (m || []).map(m => {
      m.machineServingMaterial.material.name;
      if (m.machineServingMaterial && m.machineServingMaterial.material && m.machineServingMaterial.material.name) {
        arr.push(m.machineServingMaterial.material.name);
      }
    });
    return arr.join(',');
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
