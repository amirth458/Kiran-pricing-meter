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
  public customer: CustomerData;
  public tabs = [];
  public selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);

  processProfiles: any[] = null;
  pricingProfiles: any[] = null;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    protected spinner: NgxSpinnerService,
    protected ordersService: OrdersService
  ) {
    this.route.params.subscribe(params => {
      this.selectedId = params.partId;
      this.getDetails(this.selectedId);
    });

    this.selectedTabId$.subscribe(async v => {
      if (v === 2 && this.processProfiles === null) {
        this.getProcessProfile();
      }
      if (v === 3 && this.pricingProfiles === null) {
        if (this.processProfiles === null) {
          await this.getProcessProfile();
        }
        if (this.processProfiles.length) {
          this.getPricingProfiles();
        } else {
          this.pricingProfiles = [];
        }
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
      this.userService.getCustomer(this.part.rfqMedia.media.customerId).subscribe(customer => {
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

  async getProcessProfile(q = null) {
    this.spinner.show();
    const res = await this.ordersService.getProcessProfiles(this.part.rfqMedia.id).toPromise();

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
        currentData = await this.pricingService
          .getScreenPricingProfileByPartId(
            this.part.id,
            this.processProfiles.map(profile => profile.profileId),
            filter
          )
          .toPromise();
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
