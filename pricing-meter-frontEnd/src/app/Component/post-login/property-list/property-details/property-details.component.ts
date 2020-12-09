import {AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import * as CanvasGauges from 'canvas-gauges';
import {interval, Observable} from "rxjs";
import {RadialGauge} from "@biacsics/ng-canvas-gauges";
import {map, tap} from "rxjs/operators";
import {LoginDialogComponent} from "../../../agent/login-dialog/login-dialog.component";
import {AppComponentBase} from "../../../../Shared/AppBaseComponent";
import {FeedBackComponent} from "../feed-back/feed-back.component";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent extends AppComponentBase implements OnInit, AfterViewInit {

  public left_price: any[];
  public main_price: any[];
  public right_price: any[];
  public left_angle = -122;
  public right_angle= -122;
  public main_angle= -122;

  public propertyReview: any[];
  public neighborhoodReview: any[];
  public thirdReview: any[];
  @ViewChild('gauge', { static: true })
  protected canvas: ElementRef;
  public value$: Observable<number>;
  @ViewChild('progress_gauge')
  private radialGauge: RadialGauge;
  public active = true;
  public mainMeter = -120;

  public myValueProperty = 10;
  options: CanvasGauges.GenericOptions
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    // const results = Splitting({ by: 'chars', whitespace: true })
    this.right_angle += (67 * 0.33);
    this.main_angle += ((830 - 440 )* 0.34) ;
    this.left_angle += ((950 - 440 )* 0.33);
    this.main_price = [ '$', 8 , 3 , 0 , 'k'];
    this.left_price = [ '$', 9 , 5 , 0 , 'k'];
    this.right_price = [ '$', 0 , 6 , 7 , 'k'];
    this.propertyReview = [
      {value: 1 },
      {value: 2} ,
      {value: 3},
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
    this.mainMeter +=(830 - 440 / 0.36)
  }

  ngAfterViewInit() {
  }

  getActiveButton(): any {
    return this.active ? {
      'color' : '#FFFFFF',
      'background': '#407BFF'
    }: {};
  }

  shareFeedback(): void {

      const dialogRef = this.dialog.open(FeedBackComponent, {
        data: {action: 'feedBack'},
        width: '550px',
        height: 'auto'
      });
  }

}
