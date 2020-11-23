import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {AppComponentBase} from "../../Shared/AppBaseComponent";
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends AppComponentBase implements OnInit, OnDestroy {

  private loggedInSubscription: ISubscription;
  // private freshChatSubscription: ISubscription;

  public isAuthenticated = false;

  constructor(private inject: Injector) {
    super(inject);
    this.loggedInSubscription = this.loginService.isUserLoggedIn.subscribe(res => {
      this.isAuthenticated = this.loginService.isAuthenticated();
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.loggedInSubscription.unsubscribe();
  }

}
