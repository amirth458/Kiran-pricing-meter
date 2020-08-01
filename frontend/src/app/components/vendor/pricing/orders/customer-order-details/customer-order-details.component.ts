import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { PriceDetailComponent } from '../../rfq/price-detail/price-detail.component';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { UserService } from '../../../../../service/user.service';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-customer-order-details',
  templateUrl: './customer-order-details.component.html',
  styleUrls: ['./customer-order-details.component.css']
})
export class CustomerOrderDetailsComponent extends PriceDetailComponent implements OnInit {
  measurementUnits: any = [];
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    protected customerService: CustomerService,
    protected spinner: NgxSpinnerService,
    protected ordersService: OrdersService
  ) {
    super(route, router, pricingService, userService, customerService, spinner, ordersService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.ordersService.getAllMeasurementUnitType().subscribe((v: any) => {
      this.measurementUnits = v.metadataList || [];
    });
  }

  setTabInfo() {
    this.tabs = [
      {
        id: 0,
        title: 'Order Information'
      },
      {
        id: 1,
        title: 'Sub Order Information'
      }
    ];
  }
}
