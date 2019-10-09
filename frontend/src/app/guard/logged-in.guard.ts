import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthService } from '../service/auth.service';
import { Store, AppTypes } from '../store';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private store: Store<any>,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('CanActivate');
    console.log(this.router.url);
    const user = this.userService.getUserInfo();
    console.log(user);
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch({
        type: AppTypes.GetVendorInfo
      });
      this.store.dispatch({
        type: AppTypes.GetUserInfo
      });
      if (user.is_admin) {
        if (!this.router.url.includes('admin')) {
          this.router.navigate(['/admin']);
        }
      } else {
        if (this.router.url.includes('admin')) {
          this.router.navigate(['/profile']);
        }
      }
    }
    return isLoggedIn;
  }
}
