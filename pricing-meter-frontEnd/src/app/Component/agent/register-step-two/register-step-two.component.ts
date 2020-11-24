import {Component, Injector, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-register-step-two',
  templateUrl: './register-step-two.component.html',
  styleUrls: ['./register-step-two.component.scss']
})
export class RegisterStepTwoComponent extends AppComponentBase implements OnInit {

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
