import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { Router, NavigationEnd } from "@angular/router";

declare let ga: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(@Inject(DOCUMENT) document: any, public router: Router) {
    // if (environment.local !== true) {
    //   if (location.protocol === 'http:') {
    //     document.location.href = location.href.replace('http', 'https');
    //   }
    // }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga("set", "page", event.urlAfterRedirects);
        ga("send", "pageview");
      }
    });
  }

  ngOnInit(): void {}
}
