import { Observable, of } from "rxjs";
import { FilterOption } from "./../model/vendor.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RfqPricingService {
  constructor(private http: HttpClient) {}

  getRecentAutoPrices(filterOption: FilterOption = null): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customer: "DetailCo",
          rfq: "58200",
          part: "58200.1",
          filename: "Rotor_No_Logo.stl",
          quantity: 25,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 2,
          customer: "VendCo",
          rfq: "234",
          part: "234.2",
          filename: "Roto.stl",
          quantity: 34,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 3,
          customer: "PrintCo",
          rfq: "456",
          part: "456.1",
          filename: "Jaw-original.stl",
          quantity: 56,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 4,
          customer: "PrintCo",
          rfq: "456",
          part: "456.4",
          filename: "Design_Jaw.step",
          quantity: 13,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 5,
          customer: "DetailCo",
          rfq: "678",
          part: "678.3",
          filename: "Rotor.stl",
          quantity: 23,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 6,
          customer: "RotorCo",
          rfq: "894",
          part: "894.2",
          filename: "Jaw-original.stl",
          quantity: 87,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 7,
          customer: "IronCo",
          rfq: "978",
          part: "978.1",
          filename: "Design_Jaw.step",
          quantity: 40,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        }
      ]
    };
    return of(data);
  }

  getQueuedManualPricing(filterOption: FilterOption = null): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customer: "DetailCo",
          rfq: "58200",
          part: "58200.1",
          filename: "Rotor_No_Logo.stl",
          quantity: 25,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 2,
          customer: "VendCo",
          rfq: "234",
          part: "234.2",
          filename: "Roto.stl",
          quantity: 34,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 3,
          customer: "PrintCo",
          rfq: "456",
          part: "456.1",
          filename: "Jaw-original.stl",
          quantity: 56,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 4,
          customer: "PrintCo",
          rfq: "456",
          part: "456.4",
          filename: "Design_Jaw.step",
          quantity: 13,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 5,
          customer: "DetailCo",
          rfq: "678",
          part: "678.3",
          filename: "Rotor.stl",
          quantity: 23,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 6,
          customer: "RotorCo",
          rfq: "894",
          part: "894.2",
          filename: "Jaw-original.stl",
          quantity: 87,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 7,
          customer: "IronCo",
          rfq: "978",
          part: "978.1",
          filename: "Design_Jaw.step",
          quantity: 40,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        }
      ]
    };
    return of(data);
  }

  getManuallyPriced(filterOption: FilterOption = null): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customer: "111",
          rfq: "58200",
          part: "58200.1",
          filename: "Rotor_No_Logo.stl",
          quantity: 25,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 2,
          customer: "VendCo",
          rfq: "234",
          part: "234.2",
          filename: "Roto.stl",
          quantity: 34,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 3,
          customer: "PrintCo",
          rfq: "456",
          part: "456.1",
          filename: "Jaw-original.stl",
          quantity: 56,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 4,
          customer: "PrintCo",
          rfq: "456",
          part: "456.4",
          filename: "Design_Jaw.step",
          quantity: 13,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 5,
          customer: "DetailCo",
          rfq: "678",
          part: "678.3",
          filename: "Rotor.stl",
          quantity: 23,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 6,
          customer: "RotorCo",
          rfq: "894",
          part: "894.2",
          filename: "Jaw-original.stl",
          quantity: 87,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        },
        {
          id: 7,
          customer: "IronCo",
          rfq: "978",
          part: "978.1",
          filename: "Design_Jaw.step",
          quantity: 40,
          material: "ABS M30",
          process: "3D Printing",
          roughness: 1,
          postProcess: "Sand",
          price: "$ 1200"
        }
      ]
    };
    return of(data);
  }

  getPricingDetail(id: number): Observable<any> {
    const data = {
      id,
      customer: "DetailCo",
      rfq: "58200",
      part: "58200.1",
      filename: "Rotor_No_Logo.stl",
      quantity: 25,
      material: "ABS M30",
      process: "3D Printing",
      roughness: 1,
      postProcess: "Sand",
      price: "$ 1200"
    };
    return of(data);
  }

  getPricingProfiles(filter: FilterOption): Observable<any> {
    const data = {
      content: [{
      id: 1,
      vendorName: 'VendCo',
      pricingProfile: 'Fast',
      material: 'ABS M30',
      equipment: 'Fortus 450',
      processProfile: 'Fortus 450 BS M30',
      postProcess: 'Electropolishing',
      machinesMatched: 2,
      totalCost: 1238,
      esitmatedDelivery: '10/12/2019',
      matchScore: 4.9
    }]};
    return of(data);
  }
}
