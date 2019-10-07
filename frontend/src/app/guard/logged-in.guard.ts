import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthService } from '../service/auth.service';
import { Store, AppTypes } from '../store';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  constructor(
    public authService: AuthService,
    public router: Router,
    private store: Store<any>,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('CanActivate');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch({
        type: AppTypes.GetVendorInfo
      });
      this.store.dispatch({
        type: AppTypes.GetUserInfo
      });
    }
    return isLoggedIn;
  }
}
