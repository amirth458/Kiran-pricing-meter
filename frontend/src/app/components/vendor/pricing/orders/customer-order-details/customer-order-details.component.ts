import { BehaviorSubject } from 'rxjs';
import { OrdersService } from './../../../../../service/orders.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-order-details',
  templateUrl: './customer-order-details.component.html',
  styleUrls: ['./customer-order-details.component.css']
})
export class CustomerOrderDetailsComponent implements OnInit {
  selectedId: number;

  tabs = [];

  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: OrdersService
  ) {
    this.route.params.subscribe(params => {
      this.selectedId = params.orderId;
      //this.getDetails(this.selectedId);
    });

    this.tabs = [
      {
        id: 0,
        title: "Order Information"
      },
      {
        id: 1,
        title: "Sub Order Information"
      },
      {
        id: 2,
        title: "Past Orders"
      }
    ];
  }

  async getDetails(id: number) {
    
  }

  ngOnInit() {}
}
