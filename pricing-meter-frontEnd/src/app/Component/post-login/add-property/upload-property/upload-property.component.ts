import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-upload-property',
  templateUrl: './upload-property.component.html',
  styleUrls: ['./upload-property.component.scss']
})
export class UploadPropertyComponent extends AppComponentBase implements OnInit {
  public propertyReview: any[];
  public neighborhoodReview: any[];
  public thirdReview: any[];
  public fourthReview: any[];
  public open: boolean;
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    this.propertyReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3,},
      {value: 4},
      {value: 5},
      {value: 6},
      {value: 7 },
      {value: 8,  key: 'active'},
      {value: 9},
    ]
    this.neighborhoodReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3},
      {value: 4,  key: 'active'},
      {value: 5},
      {value: 6},
      {value: 7},
      {value: 8},
      {value: 9}
    ]
    this.thirdReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3},
      {value: 4},
      {value: 5},
      {value: 6},
      {value: 7,  key: 'active' },
      {value: 8},
      {value: 9},
    ]
    this.fourthReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3},
      {value: 4},
      {value: 5},
      {value: 6},
      {value: 7, key: 'active' },
      {value: 8},
      {value: 9},
    ]
  }
  navigateToCSV(): void {
    this.router.navigate(['pricing-meter/add-property/csv']);
  }

  navigateToPropertyList(): void {
    this.router.navigate(['pricing-meter/property-list'])
  }
}
