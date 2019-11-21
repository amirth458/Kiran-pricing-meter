import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-referral-container',
  templateUrl: './referral-container.component.html',
  styleUrls: ['./referral-container.component.css']
})
export class ReferralContainerComponent implements OnInit {

  actionbarMenu: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{
      name: string,
      route: string
    }>
  }> = [
    {
      name: 'Referral',
      tooltipMessage: 'Referral Information',
      route: 'referral',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(public route: Router) {
  }

  ngOnInit() {
  }
}
