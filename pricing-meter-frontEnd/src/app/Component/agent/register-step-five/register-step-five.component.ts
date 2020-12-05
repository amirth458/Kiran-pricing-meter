import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";

@Component({
  selector: 'app-register-step-five',
  templateUrl: './register-step-five.component.html',
  styleUrls: ['./register-step-five.component.scss']
})
export class RegisterStepFiveComponent extends AppComponentBase implements OnInit {

  constructor(private inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }
  // homePage(): void {
  //   this.router.navigate(['login']);
  // }
  homePage(): void {
    localStorage.setItem('login', 'true');
    localStorage.setItem('logined', 'user');
    this.loginService.isUserLoggedIn.next(true);
    this.navigateTo();
  }
  navigateTo(): void {
    this.router.navigate(['pricing-meter/add-property']);
  }
}
