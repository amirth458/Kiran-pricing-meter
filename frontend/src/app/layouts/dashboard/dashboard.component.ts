import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/service/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  menus: Array<{ name: string, route: string, icon: string, visible: boolean, active: boolean }> = [];
  selectedMenu = '/profile';
  sideMenuOpen = true;

  vendor: Observable<any>;
  sub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<any>,
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit(): void {
    const auth = this.authService.getAuthData();
    this.sub = this.vendor.subscribe(res => {
      if (res && res.approved) {
        this.menus = environment.menus;
        this.selectedMenu = '/profile';
      } else {
        this.menus = [];
        this.selectedMenu = '';
      }
    });
    if (auth.is_admin) {
      this.menus = environment.admin_menus;
      this.selectedMenu = '/admin';
    } else {
      this.menus = [];
      this.selectedMenu = '';
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }
}
