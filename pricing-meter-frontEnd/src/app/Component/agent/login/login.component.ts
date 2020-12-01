import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AppComponentBase implements OnInit {
    public isLogined: string;
  constructor(inject: Injector) {
    super(inject);
    localStorage.setItem('login', '');
    this.loginService.isUserLoggedIn.next(true);
  }

  ngOnInit(): void {
    this.isLogined = localStorage.getItem('logined');
  }

  navigateTo(): void {
    this.router.navigate(['agent/register-step-one']);
  }
  onLogoClick(): void {
    this.isLogined ? this.navigateToAddProperty() : this.loginPopUp();
  }
  loginPopUp(): void {
    if(this.isLogined) {
      this.navigateToAddProperty();
      return;
    }
    else {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        data: {action: 'login'},
        width: '550px',
        height: '753px'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
      });
    }
  }

  navigateToAddProperty(): void {
    localStorage.setItem('login', JSON.stringify(true));
    this.loginService.isUserLoggedIn.next(true);
    this.router.navigate(['pricing-meter/add-property']);
  }


}
