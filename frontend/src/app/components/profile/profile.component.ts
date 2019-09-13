import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  baseURL = '';

  submenus;
  selectedSubmenu;
  sidemenuClosed;


  searchColumns = [
    {
      name: 'Equipment', checked: true, query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },

    {
      name: 'Equipment', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Layer Height', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Infill', checked: true,
      query: {
        type: null,
        filter: null,
      }
    },
    {
      name: 'Tolerance Base', checked: true,
      query: {
        type: null,
        filter: null,
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
