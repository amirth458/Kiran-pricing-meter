import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../../Shared/AppBaseComponent";
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }
  navigateTo(): void {
    this.router.navigate(['pricing-meter/add-property']);
  }
  downloadCSV(): void{
    const data = [
      {
        propertyOwnerName: 'Test',
        propertyOwnerEmail: 'testing@gmail.com',
        city: 'Chennai',
        state: 'Tamil Nadu',
        streetAddrress: 'xyz street',
        zipcode: '111111',
      }
    ];
    const options = {
      headers: ["propertyOwnerName", "propertyOwnerEmail", "city", "state", "streetAddrress", "zipcode"]
    };

    new ngxCsv(data, 'Pricing_Meter_CSV', options);
  }
}
