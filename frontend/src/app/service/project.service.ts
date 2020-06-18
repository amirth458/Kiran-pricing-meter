import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConnectProject } from '../model/connect.model';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import { Pageable } from '../model/pageable.model';
import { PartOrder, ReferenceMedia } from '../model/part.model';
import { ProjectTypeEnum, OrderStatusTypeId, SearchOpt, ProjectSearchResult } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(public http: HttpClient) {}

  private buildParameters(filter: FilterOption): HttpParams {
    let params = new HttpParams();
    if (filter) {
      params = params.append('page', filter.page.toString());
      params = params.append('size', filter.size.toString());
      params = params.append('sort', filter.sort.toString());
    }
    return params;
  }

  getProjectReleaseQueue(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/part/search`;
    return this.http.post<any>(
      url,
      {
        statusIds: [18],
        projectType
      },
      { params: this.buildParameters(filter) }
    );
  }

  getConfirmationQueue(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    return this.http.post<any>(url, { statusIds: [2], projectType }, { params: this.buildParameters(filter) });
  }

  getReleasedProjects(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    return this.http.post<any>(url, { statusIds: [3], projectType }, { params: this.buildParameters(filter) });
  }

  getConnectReleasedProjects(filter: FilterOption, orderComplete = false): Observable<Pageable<PartOrder>> {
    const url = `${environment.apiBaseUrl}/admin/customer/customer-order/search`;
    return this.http.post<Pageable<PartOrder>>(
      url,
      {
        orderStatusId: orderComplete ? OrderStatusTypeId.ORDER_COMPLETE : OrderStatusTypeId.VENDOR_DOWNSELECTION,
        projectTypeId: ProjectTypeEnum.CONNECT_PROJECT
      },
      { params: this.buildParameters(filter) }
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

  releaseConnectProjectToInvite(customerOrderId: number, potentialVendorId: number[]): Observable<any> {
    const body = {
      customerOrderId,
      ids: potentialVendorId
    };
    return this.http.put<any>(
      environment.apiBaseUrl + '/admin/bidding/connect-project/release-bid-to-invited-vendor',
      body
    );
  }

  replaceConnectProjectSupplier(customerOrderId: number, oldVendorId: number, newVendorId: number): Observable<any> {
    const body = {
      customerOrderId,
      newVendorId,
      oldVendorId
    };
    return this.http.put<any>(environment.apiBaseUrl + '/admin/bidding/connect-project/replace-bid-vendor ', body);
  }

  getAllReferenceMediaFiles(partId: number): Observable<ReferenceMedia[]> {
    return this.http.get<ReferenceMedia[]>(
      `${environment.managementBaseUrl}/bids/part/${partId}/reference-media?generateSignedUrl=true`
    );
  }

  // Note: This is to fetch vendor's reference media file
  getAllProposalReferenceMediaFiles(partId: number, proposalPartId: number): Observable<ReferenceMedia[]> {
    return this.http.get<ReferenceMedia[]>(
      `${environment.managementBaseUrl}/reference-media/part/${partId}/proposal-part/${proposalPartId}?generateSignedUrl=true`
    );
  }

  searchCustomerOrder(filter: FilterOption, requestBody) {
    const url = `${environment.apiBaseUrl}/admin/customer/customer-order-search`;
    return this.http.post<Pageable<PartOrder>>(url, requestBody, { params: this.buildParameters(filter) });
  }

  getProdReleaseProject(filter: FilterOption, searchOpt: any): Observable<Pageable<ProjectSearchResult[]>> {
    const url = `${environment.apiBaseUrl}/admin/production-project/project-release-queue/search`;
    return this.http.post<Pageable<ProjectSearchResult[]>>(url, searchOpt, { params: this.buildParameters(filter) });
  }
}
