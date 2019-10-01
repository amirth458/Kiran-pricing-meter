import { Injectable } from '@angular/core';
import { Observable, Action, Effect, ofType, switchMap, map, AppTypes, AppFields,
  CreateVendorInfo, Actions, UpdateVendorInfo, GetVendorInfo, GetUserInfo } from './app.models';
import { VendorService } from '../service/vendor.service';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Injectable() export class AppEffects {

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private userService: UserService,
    private as: Actions
  ) {}

  @Effect() CreateVendorInfo: Observable<Action> = this.as.pipe(
    ofType(AppTypes.CreateVendorInfo),
    switchMap((a: CreateVendorInfo) => [a.payload]),
    map((res: any) => {
      this.userService.setVendorInfo(res);
      return {
        type: AppTypes.UpdateState,
        payload: {
          [AppFields.VendorInfo]: res
        }
      };
    })
  );

  @Effect() UpdateVendorInfo: Observable<Action> = this.as.pipe(
    ofType(AppTypes.UpdateVendorInfo),
    switchMap((a: UpdateVendorInfo) => [a.payload]),
    map((res: any) => {
      this.userService.setVendorInfo(res);
      return {
        type: AppTypes.UpdateState,
        payload: {
          [AppFields.VendorInfo]: res
        }
      };
    })
  );

  @Effect() GetVendorInfo: Observable<Action> = this.as.pipe(
    ofType(AppTypes.GetVendorInfo),
    switchMap((_: GetVendorInfo) => this.authService.getVendor()),
    map((res: any) => {
      this.userService.setVendorInfo(res);
      return {
        type: AppTypes.UpdateState,
        payload: {
          [AppFields.VendorInfo]: res
        }
      };
    })
  );

  @Effect() GetUserInfo: Observable<Action> = this.as.pipe(
    ofType(AppTypes.GetVendorInfo),
    switchMap((_: GetUserInfo) => this.authService.getProfile()),
    map((res: any) => {
      return {
        type: AppTypes.UpdateState,
        payload: {
          [AppFields.UserInfo]: res
        }
      };
    })
  );
}