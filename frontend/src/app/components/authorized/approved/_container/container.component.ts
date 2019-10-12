import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { UserService } from '../../../../service/user.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppFields } from '../../../../store';

@Component({
  selector: 'app-profile-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ProfileContainerComponent implements OnInit, OnDestroy {

  baseURL = '';

  submenus = [];
  vendorMenus = [];
  additionalSubMenus = [];
  selectedSubmenu;
  sidemenuClosed;

  vendor: Observable<any>;
  sub: Subscription;

  constructor(
    private route: Router,
    private authService: AuthService,
    private userService: UserService,
    private store: Store<any>
  ) {
    this.baseURL = this.route.url.split('/')[1];
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit() {
    this.vendorMenus = [
      {
        name: 'Vendor',
        route: this.baseURL + '/vendor'
      }
    ];

    this.additionalSubMenus = [
      {
        name: 'Processes',
        route: this.baseURL + '/processes'
      },
      {
        name: 'Post-Processes',
        route: this.baseURL + '/post-processes'
      }
    ];
    this.authService.getProfile().subscribe(res => {
      if (res) {
        this.userService.setUserInfo(res);
      }
    }, error => {
      console.log('get profile error', error);
    });

    this.sub = this.vendor.subscribe(res => {
      if (res) {
        if (res.approved) {
          this.submenus = [...this.vendorMenus, ...this.additionalSubMenus];
        } else {
          this.route.navigateByUrl('/profile/unapproved');
          this.submenus = [];
        }
      } else {
        this.submenus = [];
      }
    });
    this.selectedSubmenu = this.baseURL + '/vendor';
    const authData = this.authService.getAuthData();
    console.log(authData);
    if (authData.is_admin) {
      this.route.navigate(['/admin']);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
