import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import { of, Observable } from 'rxjs';
import { BidProcessStatusEnum, ConnectProject } from '../model/connect.model';
import { Pageable } from '../model/pageable.model';
import { PartOrder } from '../model/part.model';
import { ProjectTypeEnum } from '../model/order.model';

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

  getConnectReleasedProjects(filterOption: FilterOption, orderComplete = false): Observable<Pageable<PartOrder>> {
    const url = `${environment.apiBaseUrl}/admin/customer/customer-order/search`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.post<Pageable<PartOrder>>(
      url,
      // TODO:
      // Get all order status and use enum
      {
        orderStatusId: orderComplete ? 6 : 5,
        projectTypeId: ProjectTypeEnum.CONNECT_PROJECT
      },
      { params }
    );
  }

  getConnectProject(customerOrderId: number): Observable<ConnectProject> {
    return this.http.get<ConnectProject>(
      environment.apiBaseUrl + '/admin/bidding/connect-project/release-bid-to-vendor/' + customerOrderId
    );
  }

  releaseConnectProject(customerOrderId: number, vendorIds: number[]): Observable<any> {
    const body = {
      customerOrderId,
      productionProjectProcessProfiles: vendorIds.map(vendorId => new Object({ vendorId }))
    };
    return this.http.post<any>(environment.apiBaseUrl + '/admin/bidding/connect-project/release-bid-to-vendor', body);
  }
}
