import {Component, EventEmitter, Output} from '@angular/core';
import { AuthService } from './service/auth.service';
import {
  Router
} from '@angular/router';
import {CookieService} from "angular2-cookie/services/cookies.service";
import {globalconst} from "./common/globalconst";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [AuthService]
})

export class AppComponent {

  constructor(
    public router: Router,
    public cookieservice: CookieService
  ){

  }


  getpath(path:string):string {
    return globalconst.getpath(path);
  }

  getCSS(path:string):string {
    return globalconst.getCSS(path);
  }

  enablecommonFooter():boolean {
    return this.getpath(this.router.url) != 'chat';
  }

}
