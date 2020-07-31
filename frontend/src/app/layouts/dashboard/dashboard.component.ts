import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppFields } from '../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  menus: Array<{
    name: string;
    route: string;
    icon: string;
    visible: boolean;
    active: boolean;
  }> = [];
  selectedMenu = '/marketplace';
  sideMenuOpen = true;

  sub: Subscription;
  sidebarObserver: Observable<any>;

  private sideBarOpened = false;
  private showSearchSidebar = false;
  private selectedCustomer;
  private selectedVendor;

  constructor(private router: Router, public store: Store<any>) {
    this.menus = environment.menus;
    const urlPath = this.router.url.split('/');
    this.selectedMenu = '/' + urlPath[1];
    this.sidebarObserver = this.store.select(AppFields.App, AppFields.SidebarInfo);
  }

  ngOnInit(): void {
    this.sub = this.sidebarObserver.subscribe(res => {
      if (res) {
        if (res.customer) {
          this.selectedCustomer = res.customer;
          this.selectedVendor = null;
        } else if(res.vendor) {
          this.selectedVendor = res.vendor;
          this.selectedCustomer = null;
        } else {
          this.showSearchSidebar = true;
        }
        this.showSearchSidebar = false;
        this.sideBarOpened = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }

  private toggleSidebar() {
    this.selectedCustomer = null;
    this.selectedVendor = null;
    this.showSearchSidebar = true;
    this.sideBarOpened = !this.sideBarOpened;
  }
}
