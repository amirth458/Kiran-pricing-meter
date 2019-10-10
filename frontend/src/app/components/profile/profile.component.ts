import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  baseURL = '';

  submenus = [];
  vendorMenus = [];
  additionalSubMenus = [];
  selectedSubmenu;
  sidemenuClosed;


  searchColumns = [
    {
      name: 'Equipment', checked: true, query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },

    {
      name: 'Equipment', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
  ];
  filterColumns = [
    {
      name: 'Equipment', checked: true
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: true
    },
    {
      name: 'Infill', checked: true
    },
    {
      name: 'Tolerance Base', checked: true
    },

    {
      name: 'Equipment', checked: true
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: true
    },
    {
      name: 'Infill', checked: true
    },
    {
      name: 'Tolerance Base', checked: true
    },
  ];
  activeColumns = [];
  options = [
    'is',
    `isn't`,
    `doesn't contain`,
    'starts with',
    'ends with',
    'is empty',
    'is not empty',
  ];
  type = ['search', 'filter'];

  vendor: Observable<Vendor>;
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
        this.submenus = [...this.vendorMenus, ...this.additionalSubMenus];
      } else {
        this.submenus = [...this.vendorMenus];
      }
    });
    this.selectedSubmenu = this.baseURL + '/vendor';
    const authData = this.authService.getAuthData();
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
