import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConnectProject, ClientProgress } from '../model/connect.model';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import { Pageable } from '../model/pageable.model';
import { PartOrder, ReferenceMedia, RfqFilter } from '../model/part.model';
import { ProjectTypeEnum, OrderStatusTypeId, SearchOpt, ProjectSearchResult } from '../model/order.model';
import { Util } from '../util/Util';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(public http: HttpClient) {}

  getAllSuborderReleaseQueue(filter: FilterOption, searchOpt: any): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project`;
    return this.http.post<any>(url, searchOpt, { params: Util.buildParameters(filter) });
  }

  createBidItems(selectedBidItems): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/group-pm-parts`;
    return this.http.post<any>(url, selectedBidItems);
  }

  getAllSuppliersListByPartIds(partIds): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/suppliers`;
    return this.http.post<any>(url, partIds);
  }

  getAllSuppliersAndPartId(partIds): Observable<any> {
    const suppliersUrl = `${environment.apiBaseUrl}/admin/pm-project/suppliers`;
    return this.http.post<any>(suppliersUrl, { partIds });
  }

  saveReleasePMBidToVendor(payload): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/release-bid-to-vendor`;
    return this.http.post<any>(url, payload);
  }

  getProjectReleaseQueue(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/part/search`;
    return this.http.post<any>(
      url,
      {
        statusIds: [18],
        projectType
      },
      { params: Util.buildParameters(filter) }
    );
  }

  getConfirmationQueue(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    return this.http.post<any>(url, { statusIds: [2], projectType }, { params: Util.buildParameters(filter) });
  }

  getReleasedProjects(filter: FilterOption, projectType: string = null) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    return this.http.post<any>(url, { statusIds: [3], projectType }, { params: Util.buildParameters(filter) });
  }

  getConnectReleasedProjects(filter: FilterOption, orderComplete = false): Observable<Pageable<PartOrder>> {
    const url = `${environment.apiBaseUrl}/admin/customer/customer-order/search`;
    return this.http.post<Pageable<PartOrder>>(
      url,
      {
        orderStatusId: orderComplete ? OrderStatusTypeId.ORDER_COMPLETE : OrderStatusTypeId.VENDOR_DOWNSELECTION,
        projectTypeId: ProjectTypeEnum.CONNECT_PROJECT
      },
      { params: Util.buildParameters(filter) }
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

  searchCustomerOrder(filter: FilterOption, requestBody, showTestAccount) {
    const url = `${environment.apiBaseUrl}/admin/customer/customer-order-search`;
    return this.http.post<Pageable<PartOrder>>(
      url,
      { ...requestBody, showTestAccount },
      { params: Util.buildParameters(filter) }
    );
  }

  getProdReleaseProject(filter: FilterOption, searchOpt: any): Observable<Pageable<ProjectSearchResult[]>> {
    const url = `${environment.apiBaseUrl}/admin/production-project/project-release-queue/search`;
    return this.http.post<Pageable<ProjectSearchResult[]>>(url, searchOpt, { params: Util.buildParameters(filter) });
  }

  getProdVendorReleaseProject(filter: FilterOption, searchOpt: any): Observable<Pageable<ProjectSearchResult[]>> {
    const url = `${environment.apiBaseUrl}/admin/production-project/vendor-confirmation-released-queue/search`;
    return this.http.post<Pageable<ProjectSearchResult[]>>(url, searchOpt, { params: Util.buildParameters(filter) });
  }

  getVendorCustomerProgress(customerOrderId, vendorId): Observable<ClientProgress> {
    const url = `${environment.apiBaseUrl}/admin/bidding/connect-project/progress-check`;
    let params = new HttpParams();
    params = params.append('customer-order-id', customerOrderId.toString());
    params = params.append('vendor-id', vendorId.toString());
    return this.http.get<ClientProgress>(url, { params });
  }

  getProposalFormData(proposalPartId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/admin/part-proposal/${proposalPartId}`);
  }

  searchRfq(req: FilterOption, filter: RfqFilter): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/pm-rfq`;
    return this.http.post<any>(url, filter, { params: Util.buildParameters(req) });
  }

  searchPmProgramRfq(req: FilterOption, filter: RfqFilter): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/pm-program-rfq`;
    return this.http.post<any>(url, filter, { params: Util.buildParameters(req) });
  }

  searchConnectProgramRfq(req: FilterOption, filter: RfqFilter): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/connect-project/connect-program-rfq`;
    return this.http.post<any>(url, filter, { params: Util.buildParameters(req) });
  }
}
