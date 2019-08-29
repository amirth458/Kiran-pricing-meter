import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Navigation } from 'selenium-webdriver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  baseURL = '';

  actionbarMenu = [
    {
      name: 'Basic Details',
      tooltipMessage: 'At vero eos et accusamus et'
    },
    {
      name: 'Facilities',
      tooltipMessage: 'At vero eos et accusamus et'
    },
    {
      name: 'Preferences',
      tooltipMessage: 'At vero eos et accusamus et'
    },
    {
      name: 'Machines',
      tooltipMessage: 'At vero eos et accusamus et'
    },
    {
      name: 'Shipping',
      tooltipMessage: 'At vero eos et accusamus et'
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  submenus;
  selectedSubmenu;

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('#')[0];
  }

  ngOnInit() {
    this.submenus = [
      {
        name: 'Home',
        route: this.baseURL + '/home'
      },
      {
        name: 'Vendor',
        route: this.baseURL + '/vendor'
      },
      {
        name: 'Processes',
        route: this.baseURL + '/processes'
      },
      {
        name: 'Post-Processes',
        route: this.baseURL + '/post-processes'
      }
    ];
    this.selectedSubmenu = this.baseURL + '/vendor';
  }

}
