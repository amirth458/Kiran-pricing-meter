import {Component, Injector, OnInit} from '@angular/core';
import {LoginDialogComponent} from "../../Component/agent/login-dialog/login-dialog.component";
import {AppComponentBase} from "../../Shared/AppBaseComponent";

@Component({
  selector: 'app-pre-header',
  templateUrl: './pre-header.component.html',
  styleUrls: ['./pre-header.component.scss']
})
export class PreHeaderComponent extends AppComponentBase implements OnInit {
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

  getActiveRoutes(path) : boolean {
    return window.location.pathname.includes(path);
  }
}
