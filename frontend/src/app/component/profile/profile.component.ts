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
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'basics',
      actions: []
    },
    {
      name: 'Facilities',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'facilities',
      actions: ['Add Facility']
    },
    {
      name: 'Preferences',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'preferences',
      actions: []
    },
    {
      name: 'Machines',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'machines',
      actions: ['Add Machine']
    },
    {
      name: 'Shipping',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'shipping',
      actions: ['Add Carrier']
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  submenus;
  selectedSubmenu;


  searchColumns = [
    {
      name: 'Equipment', checked: true, query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },

    {
      name: 'Equipment', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        queryString: null,
      }
    },
  ];
  filterColumns = [
    {
      name: 'Equipment', checked: true
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: true
    },
    {
      name: 'Infill', checked: true
    },
    {
      name: 'Tolerance Base', checked: true
    },

    {
      name: 'Equipment', checked: true
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: true
    },
    {
      name: 'Infill', checked: true
    },
    {
      name: 'Tolerance Base', checked: true
    },
  ];
  activeColumns = [];
  options = [
    'is',
    `isn't`,
    `doesn't contain`,
    'starts with',
    'ends with',
    'is empty',
    'is not empty',
  ];
  type = ['search', 'filter'];
  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
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
