import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  userInfo = {
    name: '',
    img: 'assets/image/avatar3.png'
  };
  sub: Subscription;


  constructor(
    public router: Router,
    public authService: AuthService,
    public store: Store<any>,
    public user: UserService
  ) {

  }

  ngOnInit() {
    this.sub = this.user.getVendorInfo();

    if (this.sub) {
      this.userInfo = {
        ...this.userInfo,
        ...this.sub
      };
    }

    console.log({ user: this.userInfo });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
