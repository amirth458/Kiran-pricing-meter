import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as CanvasGauges from 'canvas-gauges';
import {interval, Observable} from "rxjs";
import {RadialGauge} from "@biacsics/ng-canvas-gauges";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {
  public propertyReview: any[];
  public neighborhoodReview: any[];
  public thirdReview: any[];
  @ViewChild('gauge', { static: true })
  protected canvas: ElementRef;
  public value$: Observable<number>;
  @ViewChild('progress_gauge')
  private radialGauge: RadialGauge;
  public active = true;

  public myValueProperty = 10;
  options: CanvasGauges.GenericOptions
  constructor() { }

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
  }

  ngAfterViewInit() {

    this.radialGauge.update({ colorBarProgress: 'rgba(0,200,200,.75)' });

    // update both the gauge value and valueText every 200 ms.
    // this.value$ = interval(200).pipe(
    //   map(i => i % 100),
    //   tap(i => this.radialGauge.update( {valueText: i } ))
    // );
  }

}
