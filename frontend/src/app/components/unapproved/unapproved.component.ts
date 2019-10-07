import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-unapproved',
  templateUrl: './unapproved.component.html',
  styleUrls: ['./unapproved.component.css']
})
export class UnapprovedComponent implements OnInit, OnDestroy {
  registerMenu = {
    name: 'Register',
    tooltipMessage: 'Register Users.',
    route: 'register',
  };
  vendorMenu = {
    name: 'Vendor Details',
    tooltipMessage: 'Vendor Details.',
    route: 'vendor-register',
  };
  machineMenu = {
    name: 'Machine Details',
    tooltipMessage: 'Machine Details.',
    route: 'machine-register',
  };
  actionbarMenu = [];
  selectedTab = 'Register';
  registerStep: Observable < number > ;
  subRegisterStep: Subscription;
  step = 0;

  constructor(private route: Router, private store: Store < any > ) {
    this.registerStep = this.store.select(AppFields.App, AppFields.RegisterStep);
  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('unapproved/') + 'unapproved/'.length).split('/');
    switch (routeArr[0]) {
      case 'register':
        this.selectedTab = 'Register';
        break;
      case 'vendor-register':
        this.selectedTab = 'Vendor Details';
        break;
      case 'machine-register':
        this.selectedTab = 'Machine Details';
        break;
      default:
        this.selectedTab = 'Register';
        break;
    }
    this.actionbarMenu = [this.registerMenu];
    this.subRegisterStep = this.registerStep.subscribe(res => {
      if (res) {
        this.step = Number(res);
      } else {
        this.step = 0;
      }
      this.actionbarMenu = [this.registerMenu, this.vendorMenu, this.machineMenu];
      if (Number(res) === 1) {
        this.route.navigateByUrl('/unapproved/vendor-register');
      } else if (Number(res) === 2) {
        this.route.navigateByUrl('/unapproved/machine-register');
      }
    });
  }
  ngOnDestroy() {
    if (this.subRegisterStep) {
      this.subRegisterStep.unsubscribe();
    }
  }
}
