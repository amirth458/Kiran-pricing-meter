import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit, OnDestroy {

  actionbarBasicMenu: Array < {
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array < {
      name: string,
      route: string
    } >
  } > = [{
    name: 'Corporate Details',
    tooltipMessage: 'High level information about your business operations.',
    route: 'basics',
    actions: []
  }];

  arrAdditionalMenuItems = [{
      name: 'Facilities',
      tooltipMessage: 'Details regarding specific manufacturing facilities. ' +
        'If you have different individuals quoting for different divisions, create that delineation here',
      route: 'facilities',
      actions: [{
        name: 'Add Facility',
        route: 'add'
      }]
    },
    {
      name: 'Preferences',
      tooltipMessage: 'Specify the industries you currently support, seek to support, and would rather not support',
      route: 'preferences',
      actions: []
    },
    {
      name: 'Machines',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'machines',
      actions: [{
        name: 'Add Machine',
        route: 'add'
      }]
    },
    {
      name: 'Shipping',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'shipping',
      actions: [{
        name: 'Add Carrier',
        route: 'add'
      }]
    }
  ];
  actionbarMenu = [];
  selectedTab = this.actionbarBasicMenu[0].name;
  vendor: Observable<Vendor>;
  sub: Subscription;

  constructor(
    private route: Router,
    private store: Store<any>
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('profile/vendor/') + 'profile/vendor/'.length).split('/');
    switch (routeArr[0]) {
      case 'basics':
        this.selectedTab = 'Corporate Details';
        break;
      case 'facilities':
        this.selectedTab = 'Facilities';
        break;
      case 'preferences':
        this.selectedTab = 'Preferences';
        break;
      case 'machines':
        this.selectedTab = 'Machines';
        break;
      case 'shipping':
        this.selectedTab = 'Shipping';
        break;
      default:
        this.selectedTab = 'Corporate Details';
        break;
    }

    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.actionbarMenu = [...this.actionbarBasicMenu, ...this.arrAdditionalMenuItems];
      } else {
        this.actionbarMenu = [...this.actionbarBasicMenu];
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
