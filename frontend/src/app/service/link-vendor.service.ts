import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Vendor } from '../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class LinkVendorService {
  constructor(public http: HttpClient, public userService: UserService) {}

  linkVendor(customerId: string, vendorIds: string[]) {
    const body = {
      customerId,
      vendorIds
    };
    return this.http.put(environment.apiBaseUrl + '/admin/customer/customer-vendor-preference', body);
  }
  getLink(
    customerId: string
  ): Observable<{
    customerId: number;
    vendorIds: number[];
    vendorProfiles: Vendor[];
  }> {
    return this.http.get<{
      customerId: number;
      vendorIds: number[];
      vendorProfiles: Vendor[];
    }>(environment.apiBaseUrl + `/admin/customer/customer-vendor-preference?customer-id=${customerId}`);
  }
}
