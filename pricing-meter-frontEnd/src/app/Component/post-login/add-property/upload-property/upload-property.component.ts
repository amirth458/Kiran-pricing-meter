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
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    this.propertyReview = [
      {value: 1 , name: 'Poor' },
      {value: 2 , name: 'Not Good'} ,
      {value: 3 , name: 'Average'},
      {value: 4,  name: 'Good', key: 'active'},
      {value: 5 , name: 'Excellent'},
    ];
    this.neighborhoodReview = [
      {value: 1 , name: 'No View'},
      {value: 2 , name: 'Peekaboo'} ,
      {value: 3, name: 'Not Bad'},
      {value: 4,  name: 'That’s Nice',  key: 'active'},
      {value: 5, name: '360° & Stunning'},
    ];
    this.thirdReview = [
      {value: 1, name: 'Tear Down' },
      {value: 2, name: 'Fixer'},
      {value: 3, name: 'Turn Key'} ,
      {value: 4, name: 'Updated'},
      {value: 5,  name: 'Done to the 9\'s',  key: 'active'},

    ];
    this.fourthReview = [
      {value: 1 , name: 'Strong Buyer\'s Market '},
      {value: 2, name: 'Buyer\'s Market'} ,
      {value: 3, name: 'Neutral Market'},
      {value: 4,  name: 'Seller\'s Market', key: 'active'},
      {value: 5, name: 'Strong Seller\'s market'},
    ];
  }
  navigateToCSV(): void {
    this.router.navigate(['pricing-meter/add-property/csv']);
  }

  navigateToPropertyList(): void {
    this.router.navigate(['pricing-meter/property-list']);
  }
  changeStyle(value , object){
    console.log("object",object);
    for(let i=0;i<=object.length;i++)
    {
      if(i == value -1)
      {
        object[i].key = 'active'
      }else{
        object[i].key = ''
      }
    }
  }
}
