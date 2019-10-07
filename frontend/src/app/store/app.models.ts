import { Vendor } from '../model/vendor.model';

export { select, Store, Action } from '@ngrx/store';
export { Effect, Actions, ofType } from '@ngrx/effects';
export { Observable } from 'rxjs';
export { switchMap, map } from 'rxjs/operators';

export enum AppFields {
  App = 'app',
  UserInfo = 'user-info',
  VendorInfo = 'vendor-info',
  RegisterStep = 'register-step',
}

export interface AppState {
    [AppFields.VendorInfo]: Vendor;
}

export const InitialState: AppState = {
    [AppFields.VendorInfo]: null
};

export enum AppTypes {
  UpdateState = 'update-app-state',
  GetVendorInfo = 'get-vendor-info',
  CreateVendorInfo = 'create-vendor-info',
  UpdateVendorInfo = 'update-vendor-info',
  GetUserInfo = 'get-user-info',
  RegsiterStepInfo = 'get-register-step'
}

export interface UpdateState { type: AppTypes.UpdateState; payload: any; }
export interface CreateVendorInfo { type: AppTypes.CreateVendorInfo; payload: any; }
export interface UpdateVendorInfo { type: AppTypes.UpdateVendorInfo; payload: any; }
export interface GetVendorInfo { type: AppTypes.GetVendorInfo; }
export interface GetUserInfo { type: AppTypes.GetUserInfo; }
export interface GetRegisterStep { type: AppTypes.RegsiterStepInfo; payload: any;  }

export type AppAction = UpdateState;
