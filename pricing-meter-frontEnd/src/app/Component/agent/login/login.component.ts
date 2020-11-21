import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }

  navigateTo(): void {
    this.router.navigate(['agent/register-step-one']);
  }

  loginPopUp(): void {
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
