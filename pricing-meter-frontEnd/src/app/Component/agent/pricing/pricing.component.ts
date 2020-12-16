import {Component, Injector, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent extends AppComponentBase implements OnInit {

  public option = false;

  constructor( injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
  }
  getClass(button: string): any {
    if (button === 'indivual') {
      return this.option ? 'btn-active' : 'tab-btn';
    } else {
      return this.option ?   'tab-btn' : 'btn-active';
    }
  }

  navigateTo(): void{
    this.router.navigate(['agent/register-step-three']);
  }

  homePage(): void{
    this.router.navigate(['login']);
  }

}
