import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../Shared/AppBaseComponent';

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
  public rateTheLocation: number = 1;
  public rateTheView: number = 2;
  public rateTheCondition: number = 5;
  public propertyLocated: number = 3;
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    this.propertyReview = [
      {value: 1 , name: 'Poor', key: '' },
      {value: 2 , name: 'Not Good' , key: ''} ,
      {value: 3 , name: 'Average', key: ''},
      {value: 4,  name: 'Good', key: ''},
      {value: 5 , name: 'Excellent', key: ''},
    ];
    this.neighborhoodReview = [
      {value: 1 , name: 'No View', key: ''},
      {value: 2 , name: 'Peekaboo', key: ''} ,
      {value: 3, name: 'Not Bad', key: ''},
      {value: 4,  name: 'That’s Nice', key: ''},
      {value: 5, name: '360° & Stunning', key: ''},
    ];
    this.thirdReview = [
      {value: 1, name: 'Tear Down', key: '' },
      {value: 2, name: 'Fixer', key: ''},
      {value: 3, name: 'Turn Key', key: ''} ,
      {value: 4, name: 'Updated', key: ''},
      {value: 5,  name: 'Done to the 9\'s', key: ''},

    ];
    this.fourthReview = [
      {value: 1 , name: 'Strong Buyer\'s Market ', key: ''},
      {value: 2, name: 'Buyer\'s Market', key: ''} ,
      {value: 3, name: 'Neutral Market', key: ''},
      {value: 4,  name: 'Seller\'s Market', key: ''},
      {value: 5, name: 'Strong Seller\'s market', key: ''},
    ];
    this.setKey();
  }
  navigateToCSV(): void {
    this.router.navigate(['pricing-meter/add-property/csv']);
  }

  navigateToPropertyList(): void {
    this.router.navigate(['pricing-meter/property-list']);
  }
  changeStyle(value , object, str){
    for(let i=0;i<=object.length;i++)
    {
      if(i == value -1)
      {
        object[i].key = 'active'
        switch (str) {
          case 'rateTheLocation': {
            this.rateTheLocation = value;
            break;
          }
          case 'rateTheView': {
            this.rateTheView = value;
            break;
          }
          case 'rateTheCondition': {
            this.rateTheCondition = value;
            break;
          }
          case 'propertyLocated': {
            this.propertyLocated = value;
          }
        }
      }else{
        object[i].key = ''
      }
    }
  }
  setKey(): void {
  this.propertyReview[this.rateTheLocation - 1 ].key = 'active';
  this.neighborhoodReview[this.rateTheView - 1].key = 'active';
  this.thirdReview[this.rateTheCondition - 1].key = 'active';
  this.fourthReview[this.propertyLocated - 1].key = 'active';
  }

  showSelected(): void {
    window.alert(` Rate The Location : ${this.rateTheLocation}
     Rate The View : ${this.rateTheView}
      Rate The Condition : ${this.rateTheCondition}
      Property Located : ${this.propertyLocated}`);
  }
}
