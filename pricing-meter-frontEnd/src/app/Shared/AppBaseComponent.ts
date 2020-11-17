import {Router} from "@angular/router";
import {Injector} from "@angular/core";

export abstract class AppComponentBase {
  public router: Router;

  protected constructor(injector: Injector) {
    this.router = injector.get(Router);
  }
}
