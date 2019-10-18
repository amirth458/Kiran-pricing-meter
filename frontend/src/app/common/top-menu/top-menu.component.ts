import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit, OnDestroy {

  userInfo = {
    name: '',
    img: 'assets/image/avatar3.png'
  };
  sub: Subscription;
  vendor: Observable<any>;

  constructor(
    public router: Router,
    public authService: AuthService,
    public store: Store<any>,
    public user: UserService
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit() {
    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.userInfo = {
          ...this.userInfo,
          ...res
        };
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
