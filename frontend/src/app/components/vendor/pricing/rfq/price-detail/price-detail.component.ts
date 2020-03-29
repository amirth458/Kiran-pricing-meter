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
import { catchError } from 'rxjs/operators';

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

    this.selectedTabId$.subscribe(v => {
      if (v === 2 && this.processProfiles === null) {
        this.getProcessProfile();
      }
      if (v === 3 && this.pricingProfiles === null) {
        this.getPricingProfiles();
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
    const res = await this.ordersService
      .getMatchedProfiles(this.userService.getUserInfo().id, [this.part.rfqMedia.id])
      .toPromise();

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
    this.pricingService
      .getPricingProfiles(this.part.id)
      .pipe(
        catchError(e => {
          const message = e.error.message;
          this.spinner.hide();
          console.log(message);
          return throwError('Error');
        })
      )
      .subscribe(res => {
        this.pricingProfiles = res.map(item => ({
          selected: false,
          id: item.id,
          vendorName: item.vendorProfile.name,
          pricingProfile: item.name,
          material: item.processProfile.processMachineServingMaterialList
            .map(item => item.machineServingMaterial.material.name)
            .join(', '),
          equipment: item.processProfile.processMachineServingMaterialList
            .map(item => item.machineServingMaterial.vendorMachinery.equipment.name)
            .join(', '),
          processProfile: item.processProfile.name,
          totalCost: null
        }));
        this.spinner.hide();
      });
  }
}
