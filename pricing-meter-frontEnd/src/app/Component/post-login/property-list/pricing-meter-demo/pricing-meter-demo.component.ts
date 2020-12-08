import { Component, OnInit } from '@angular/core';
// declare var $:JQueryStatic;

@Component({
  selector: 'app-pricing-meter-demo',
  templateUrl: './pricing-meter-demo.component.html',
  styleUrls: ['./pricing-meter-demo.component.scss']
})
export class PricingMeterDemoComponent implements OnInit {
  public price: any[];
  constructor() {
  }


  ngOnInit(): void {
    this.price = [ '$', 7 , 0 , 0 , 'k'];

  }



}
