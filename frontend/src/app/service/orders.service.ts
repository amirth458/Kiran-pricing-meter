import { Injectable } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ColDef } from 'ag-grid-community/src/ts/entities/colDef';

import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

import { BiddingOrder } from '../model/bidding.order';
import { BiddingOrderDetail, GetAllCustomerPartView } from '../model/bidding.order.detail';
import { BidVendorMatchingProfileDetails } from '../model/confirm.sub-order.release';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import {
  Part,
  PartQuote,
  ProcessProfileDetailedView,
  MatchedProcessProfile,
  BidProjectProcess,
  PartStatusSequenced
} from '../model/part.model';
import { Util } from '../util/Util';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient, public datePipe: DatePipe, public currencyPipe: CurrencyPipe) {}

  getSubOrderReleaseQueue(filterOption: FilterOption): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/part/placing-order-status`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    return this.http.get<any>(url, { params });
  }

  getStartedBidOrders(): Observable<Array<BiddingOrder>> {
    return this.http.get<Array<BiddingOrder>>(`${environment.apiBaseUrl}/admin/bidding/started-bid-orders`);
  }

  getPastOrders(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customerOrder: 234,
          subOrder: '234.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 2,
          customerOrder: 234,
          subOrder: '234.2',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 3,
          customerOrder: 456,
          subOrder: '456.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 4,
          customerOrder: 456,
          subOrder: '456.4',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 5,
          customerOrder: 128,
          subOrder: '128.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        }
      ]
    };
    return of(data);
  }

  getReleasedBiddingOrders(): Observable<Array<BiddingOrder>> {
    return this.http.get<Array<BiddingOrder>>(`${environment.apiBaseUrl}/admin/bidding/released-bid-orders`);
  }

  getConnectReleasedBiddingOrders(page, size, filter, vendorOrderType): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/admin/vendor/connect-project/vendor-orders?page=${page}&size=${size}`,
      {
        ...filter,
        vendorOrderType
      }
    );
  }
  getSubOrderReleaseConfirmation() {
    const url = `${environment.apiBaseUrl}/admin/bidding/sub-order-release-confirmation`;
    return this.http.get<any>(url);
  }

  getFullfillmentSettings(): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
    return this.http.get(url);
  }

  setFullfillmentSetting(data): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
    return this.http.put(url, data);
  }

  getMatchingProcessProfiles(
    rfqMediaIds: number[],
    isGlobalRule = false,
    appId = 3
  ): Observable<MatchedProcessProfile[]> {
    const url = `${environment.apiBaseUrl}/admin/part/matching-process-profile`;
    return this.http.post<MatchedProcessProfile[]>(url, {
      rfqMediaIds: rfqMediaIds.join(','),
      appId,
      isGlobalRule
    });
  }

  getMatchedProfiles(userId: number, rfqMediaIds: number[]): Observable<ProcessProfileDetailedView[]> {
    const url = `${environment.apiBaseUrl}/admin/part/matched-profiles`;
    let params = new HttpParams();
    params = params.append('userId', userId.toString());
    params = params.append('rfqMediaIds', rfqMediaIds.join(','));
    return this.http.get<ProcessProfileDetailedView[]>(url, { params });
  }

  getBidOrderDetailsById(bidOrderId: number, filterOnlyWinningVendor = false): Observable<BiddingOrderDetail> {
    return this.http.get<BiddingOrderDetail>(
      `${environment.apiBaseUrl}/admin/bidding/vendor-order-details?bidOrderId=${bidOrderId}&filterOnlyWinningVendor=${filterOnlyWinningVendor}`
    );
  }

  getOrderViewColumns(view = 'order-confirmation-queue', partDetailCell): ColDef[] {
    const columns: ColDef[] = [
      {
        headerName: 'Order ID',
        field: 'bidOrder.id',
        tooltip: params => params.value,
        sortable: true,
        filter: false,
        width: 100
      },
      {
        headerName: 'Customer Name',
        field: 'customerName',
        tooltip: params => params.value,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltip: params => params.value,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Sub Order IDs',
        field: 'partIds',
        tooltip: params => (params.value || []).join(', '),
        sortable: true,
        filter: false,
        width: 240,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: partDetailCell
        }
      },
      {
        headerName: 'Sub Order Count',
        field: 'subOrderCount',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Offer IDs',
        field: 'bidProcessIds',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: v => (v && v.value && v.value.join(',')) || ''
      },
      {
        headerName: 'Vendor Order ID',
        field: 'vendorOrderId',
        hide: view !== 'released-orders',
        sortable: true,
        filter: false
      },
      {
        headerName: 'Offer Price',
        field: 'offerPrice',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3');
        }
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Technology',
        field: 'equipmentPropertyValues',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Post-Process',
        field: 'postProcess',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery Date',
        field: 'deliveryDate',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => {
          const arr = [];
          (dt.value || []).map(value => {
            arr.push(this.datePipe.transform(value, Util.dateFormat, 'UTC'));
          });
          return arr.length !== 0 ? arr.join(', ') : '';
        }
      },
      {
        headerName: 'Status',
        field: 'bidOrder.bidOrderStatusType.description',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      }
    ];
    if (view === 'order-confirmation-queue') {
      columns.splice(2, 1);
    }
    return columns;
  }

  getGridSearchColumns(released: boolean = false): any {
    return [
      {
        name: 'Order ID',
        field: 'bidOrder.id',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Sub Order IDs',
        field: 'partIds',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Sub Order Count',
        field: 'subOrderCount',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Offer IDs',
        field: 'bidProcessIds',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      released && {
        name: 'Vendor Order ID',
        field: 'vendorOrderId',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Offer Price',
        field: 'offerPrice',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Quantity',
        field: 'quantity',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Material',
        field: 'material',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Technology',
        field: 'equipmentPropertyValues',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Post-Process',
        field: 'postProcess',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Delivery Date',
        field: 'deliveryDate',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      },
      {
        name: 'Status',
        field: 'bidOrder.bidOrderStatusType.description',
        checked: false,
        query: {
          type: '',
          filter: ''
        }
      }
    ];
  }

  getGridFilterColumns(released: boolean = false): any {
    return [
      {
        name: 'Order ID',
        field: 'bidOrder.id',
        checked: true
      },
      {
        name: 'Sub Order IDs',
        field: 'partIds',
        checked: true
      },
      {
        name: 'Sub Order Count',
        field: 'subOrderCount',
        checked: true
      },
      {
        name: 'Offer IDs',
        field: 'bidProcessIds',
        checked: true
      },
      released && {
        name: 'Vendor Order ID',
        field: 'vendorOrderId',
        checked: true
      },
      {
        name: 'Offer Price',
        field: 'offerPrice',
        checked: true
      },
      {
        name: 'Quantity',
        field: 'quantity',
        checked: true
      },
      {
        name: 'Material',
        field: 'material',
        checked: true
      },
      {
        name: 'Technology',
        field: 'equipmentPropertyValues',
        checked: true
      },
      {
        name: 'Post-Process',
        field: 'postProcess',
        checked: true
      },
      {
        name: 'Delivery Date',
        field: 'deliveryDate',
        checked: true
      },
      {
        name: 'Status',
        field: 'bidOrder.bidOrderStatusType.description',
        checked: true
      }
    ];
  }

  getPartById(id: number, generateSignedUrl = true): Observable<Part> {
    return this.http.get<Part>(
      `${environment.procurementApiBaseUrl}/part/${id}?generateSignedUrl=${generateSignedUrl}`
    );
  }

  getAllMeasurementUnitType(): Observable<any> {
    return this.http.get<any>(`${environment.procurementApiBaseUrl}/metadata/measurement_unit_type`);
  }

  getPartQuotesByPartIds(partIds: Array<number>): Observable<PartQuote[]> {
    const url = `${environment.procurementApiBaseUrl}/part-quote/parts`;
    return this.http.post<PartQuote[]>(url, { partIds });
  }

  mergePartQuoteInfo(parts: Array<GetAllCustomerPartView>): Observable<GetAllCustomerPartView[]> {
    return parts.length > 0
      ? this.getPartQuotesByPartIds((parts || []).map(p => p.partId)).pipe(
          reduce((quotes: any, arr: PartQuote[]) => {
            (arr || []).map(p => (quotes[p.partId] = p));
            return quotes;
          }, {}),
          map((quotes: any) => {
            (parts || []).map(part => {
              part.priceAccepted = quotes[part.partId] ? quotes[part.partId].totalCost : null;
            });
            return parts;
          })
        )
      : of([]);
  }

  getVendorOrderInfo(bidProcessId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/admin/vendor/vendor-order-details?include-task=true&bid-process-id=${bidProcessId}`
    );
  }

  getVendorOrderInfoByOrderId(orderId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/admin/vendor/vendor-order-details?include-task=true&vendor-order-id=${orderId}`
    );
  }

  releaseProjectBidToVendor(partId, processProfiles) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/release-bid-to-vendor`;
    return this.http.post<any>(url, {
      partId,
      productionProjectProcessProfiles: processProfiles
    });
  }

  getBidProjectProcesses(partId): Observable<BidProjectProcess[]> {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/part/${partId}`;
    return this.http.get<BidProjectProcess[]>(url);
  }

  releaseProjectBidToCustomer(partId, vendorIds) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/release-matching-vendors-to-customer`;
    return this.http.put<any>(url, {
      partId,
      vendorIds
    });
  }

  getReferenceFiles(partId) {
    const url = `${environment.apiBaseUrl}/admin/reference-media/part/${partId}?generateSignedUrl=true`;
    return this.http.get<any>(url);
  }

  getReferenceFileCountByPartId(partId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/admin/reference-media/part/${partId}/count`);
  }

  getProductionOrderDetails(productionOrderInfo) {
    const url = `${environment.apiBaseUrl}/admin/vendor/production-project/vendor-order-details`;
    return this.http.post<any>(url, productionOrderInfo);
  }

  getMatchedProcessProfiles(
    bidOrderId: number,
    vendorIds: Array<number>
  ): Observable<Array<BidVendorMatchingProfileDetails> | any> {
    const url = `${environment.apiBaseUrl}/admin/bidding/${bidOrderId}/matching-process-profiles`;
    return this.http.post<Array<BidVendorMatchingProfileDetails> | any>(url, vendorIds);
  }

  getPartStatusByProjectType(projectTypeId): Observable<PartStatusSequenced[]> {
    return this.http.get<PartStatusSequenced[]>(
      `${environment.procurementApiBaseUrl}/metadata/partstatus/${projectTypeId}`
    );
  }
}
