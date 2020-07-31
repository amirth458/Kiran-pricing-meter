import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
    firstName: '',
    img: 'assets/image/avatar3.png'
  };
  sub: Subscription;
  userObserver: Observable<any>;

  @Output() public toggleSideMenu: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public router: Router,
    public authService: AuthService,
    public store: Store<any>,
    public user: UserService
  ) {
    this.userObserver = this.store.select(AppFields.App, AppFields.UserInfo);
  }

  ngOnInit() {
    this.sub = this.userObserver.subscribe(res => {
      this.userInfo = {
        ...this.userInfo,
        ...res
      };
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openSideBar() {
    this.toggleSideMenu.emit(true);
  }
}
