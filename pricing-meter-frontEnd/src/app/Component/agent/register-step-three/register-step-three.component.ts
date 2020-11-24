import {Component, Injector, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-register-step-three',
  templateUrl: './register-step-three.component.html',
  styleUrls: ['./register-step-three.component.scss']
})
export class RegisterStepThreeComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  nextPage(): void{
    this.router.navigate(['agent/register-step-four']);
  }
  homePage(): void{
    this.router.navigate(['login']);
  }
}
