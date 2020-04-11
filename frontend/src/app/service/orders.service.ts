import { Injectable } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ColDef } from 'ag-grid-community/src/ts/entities/colDef';

import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

import { BiddingOrder } from '../model/bidding.order';
import { BiddingOrderDetail, GetAllCustomerPartView } from '../model/bidding.order.detail';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import {
  Part,
  PartQuote,
  ProcessProfileDetailedView,
  MatchedProcessProfile,
  BidProjectProcess
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

  getProcessProfiles(rfqMediaId: number): Observable<MatchedProcessProfile[]> {
    const url = `${environment.apiBaseUrl}/admin/part/matching-process-profile?rfq-media-id=${rfqMediaId}`;
    return this.http.get<MatchedProcessProfile[]>(url);
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

  getOrderViewColumns(): ColDef[] {
    const columns = [
      {
        headerName: 'Order ID',
        field: 'bidOrder.id',
        tooltip: params => params.value,
        sortable: true,
        filter: false
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
          (dt.value || []).map(dt => {
            arr.push(this.datePipe.transform(dt, Util.dateFormat));
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
    return columns;
  }

  getGridSearchColumns(): any {
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
        name: 'Sub Order Count',
        field: 'subOrderCount',
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
        name: 'Process',
        field: 'process',
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

  getGridFilterColumns(): any {
    return [
      {
        name: 'Order ID',
        field: 'bidOrder.id',
        checked: true
      },
      {
        name: 'Sub Order Count',
        field: 'subOrderCount',
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
        name: 'Process',
        field: 'process',
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
              part.priceAccepted = quotes[part.partId].totalCost || null;
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

  releaseProdProjectBidToVendor(partId, processProfiles) {
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
}
