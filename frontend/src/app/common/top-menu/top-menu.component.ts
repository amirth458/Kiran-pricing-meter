import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';
import { User } from 'src/app/model/user.model';

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
  user: Observable<User>;
  sub: Subscription;


  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store<any>
  ) {
    this.user = this.store.select(AppFields.App, AppFields.UserInfo);
  }

  ngOnInit() {
    this.sub = this.user.subscribe(res => {
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
