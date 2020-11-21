import {Router} from "@angular/router";
import {Injector} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

export abstract class AppComponentBase {
  public router: Router;
  public dialog: MatDialog;

  protected constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.dialog = injector.get(MatDialog);
  }
}
