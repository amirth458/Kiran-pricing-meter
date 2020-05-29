import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import { of } from 'rxjs';
import { StatusTypes } from '../model/connect.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(public http: HttpClient) {}

  getProjectReleaseQueue(filterOption: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/part/search`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }

    return this.http.post<any>(
      url,
      {
        statusIds: [18],
        projectType
      },
      { params }
    );
  }

  getConfirmationQueue(filterOption: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.post<any>(url, { statusIds: [2], projectType }, { params });
  }

  getReleasedProjects(filterOption: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.post<any>(url, { statusIds: [3], projectType }, { params });
  }

  getProdExSupplier() {
    return of([
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.DECLINED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.AWAITING_FOR_RESPONSE
        }
      }
    ]);
  }

  getCustomerSelectedSupplier() {
    return of([
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendor: 'Vendor',
        vendorName: 'Vendor Name',
        city: 'City',
        state: 'State',
        status: {
          id: StatusTypes.DECLINED
        }
      }
    ]);
  }

  getCustomerSupplierToInvite() {
    return of([
      {
        vendorName: 'Vendor Name',
        contactName: 'Contact Name',
        email: 'Email',
        phone: 'Phone',
        status: {
          id: StatusTypes.ACCEPTED
        }
      },
      {
        vendorName: 'Vendor Name',
        contactName: 'Contact Name',
        email: 'Email',
        phone: 'Phone',
        status: {
          id: StatusTypes.DECLINED
        }
      },
      {
        vendorName: 'Vendor Name',
        contactName: 'Contact Name',
        email: 'Email',
        phone: 'Phone',
        status: {
          id: StatusTypes.AWAITING_FOR_RESPONSE
        }
      },
      {
        vendorName: 'Vendor Name',
        contactName: 'Contact Name',
        email: 'Email',
        phone: 'Phone',
        status: {
          id: StatusTypes.ACCEPTED
        }
      }
    ]);
  }
}
