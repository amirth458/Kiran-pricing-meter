import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { PricingBreakDown, PricingBreakdown } from '../model/pricing.breakdown';
import { ProcessProfile, PricingProfileDetailedView } from '../model/part.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessPricingService {
  constructor(public http: HttpClient) {}

  getAllProfiles(vendorId: number): Observable<any> {
    return this.http
      .get(environment.managementBaseUrl + `/vendors/${vendorId}/process-pricing?processProfileTypeId=1`)
      .pipe(
        map((profiles: any) => {
          (profiles || []).map(profile => {
            profile.pricingFullName = `${profile && profile.processProfile && profile.processProfile.name} : ${
              profile.name
            }`;
          });
          return profiles;
        })
      );
  }

  getProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.get(
      environment.managementBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}?processProfileTypeId=1`
    );
  }

  updateProfile(vendorId: number, profileId, formData): Observable<any> {
    return this.http.put(environment.managementBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}`, {
      ...formData,
      processProfileType: {
        id: 1
      }
    });
  }

  getProcessProfileDetail(profileIds: number[]): Observable<ProcessProfile[]> {
    const url = `${environment.managementBaseUrl}/process-profile/ids`;
    return this.http.post<ProcessProfile[]>(url, profileIds);
  }

  getPricingProfileDetail(profileIds: number[]): Observable<PricingProfileDetailedView[]> {
    const url = `${environment.managementBaseUrl}/process-pricing-profile/ids`;
    return this.http.post<PricingProfileDetailedView[]>(url, profileIds);
  }

  deleteProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.delete(
      environment.managementBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}?processProfileTypeId=1`
    );
  }

  saveProfile(vendorId: number, formData): Observable<any> {
    return this.http.post(environment.managementBaseUrl + `/vendors/${vendorId}/process-pricing`, {
      ...formData,
      processProfileType: {
        id: 1
      }
    });
  }

  storeCloneData(cloneData: any) {
    localStorage.setItem('dms-processPriceCloneData', JSON.stringify(cloneData));
  }

  getCloneData(): any {
    return JSON.parse(localStorage.getItem('dms-processPriceCloneData'));
  }

  getScreenPricingBreakdown(breakDown: PricingBreakDown): Observable<PricingBreakdown> {
    return this.http.post<PricingBreakdown>(`${environment.PPE_HOST_URL}/pricing-breakdown`, breakDown);
  }
}
