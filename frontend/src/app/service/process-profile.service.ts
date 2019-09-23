import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessProfileService {

  constructor(public http: HttpClient) { }

  getAllProfiles(vendorId: string) {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile`);
  }

  getProfile(vendorId: string, profileId: string) {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}`);
  }

  editProfile(vendorId: string, formData) {
    return this.http.put(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile`, { ...formData });
  }

  saveProfile(vendorId: string, formData) {
    return this.http.post(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile`, { ...formData });
  }
}
