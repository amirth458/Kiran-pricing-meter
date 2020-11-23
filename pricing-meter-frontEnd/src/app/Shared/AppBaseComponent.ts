import {Router} from "@angular/router";
import {Injector} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {LoginService} from "../service/login.service";

export abstract class AppComponentBase {
  //component
  public router: Router;
  public dialog: MatDialog;

  // service
  protected loginService: LoginService;

  protected constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.dialog = injector.get(MatDialog);
    this.loginService = injector.get(LoginService);
  }
}
