import { Router } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  menus: Array<{
    name: string;
    route: string;
    icon: string;
    visible: boolean;
    active: boolean;
  }> = [];
  selectedMenu = "/marketplace";
  sideMenuOpen = true;

  vendor: Observable<any>;
  sub: Subscription;

  constructor(private router: Router) {
    this.menus = environment.menus;
    const urlPath = this.router.url.split("/");
    this.selectedMenu = "/" + urlPath[1];
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }
}
