
import { Action } from '@ngrx/store';
import * as Model from './profile-screener-estimator.model';

export enum Types {
    SetRFQInfo = 'Set RFQ Info',
    SetScreenedProfiles = 'Set Screened Profile',
    SetEstimatedPrices = 'Set Estimated Prices',
    Status = 'Status',
}

export class SetRFQInfo implements Action {
    readonly type = Types.SetRFQInfo;
    constructor(public payload: any) { }
}

export class SetScreenedProfiles implements Action {
    readonly type = Types.SetScreenedProfiles;
    constructor(public payload: Array<{ profileId: number }>) { }
}

export class SetEstimatedPrices implements Action {
    readonly type = Types.SetEstimatedPrices;
    constructor(public payload: Array<any>) { }
}

export class SetStatus implements Action {
    readonly type = Types.Status;
    constructor(public payload: string) { }
}
export type All
    = SetRFQInfo |
    SetScreenedProfiles |
    SetEstimatedPrices |
    SetStatus;