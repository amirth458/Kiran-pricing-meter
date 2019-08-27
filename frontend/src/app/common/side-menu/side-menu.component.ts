import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  selectedRoute: string;
  sidebarClosed = false;
  menus = [
    {
      name: 'Program',
      route: '#program',
      icon: 'far fa-file-alt'
    },
    {
      name: 'Profile',
      route: '#profile',
      icon: 'far fa-user-circle'
    },
    {
      name: 'Fleet Control',
      route: '#fleet',
      icon: 'fas fa-wrench'
    },
    {
      name: 'Material Inventory',
      route: '#material',
      icon: 'fas fa-dolly-flatbed'
    },
    {
      name: 'Insight',
      route: '#insight',
      icon: 'far fa-chart-bar'
    },
    {
      name: 'Setting',
      route: '#setting',
      icon: 'fas fa-cogs'
    }
  ];
  constructor() { }

  ngOnInit() { }

  toggleSideBar() {
    document.querySelector('#sidebar').classList.toggle('active');
    this.sidebarClosed = !document.querySelector('#sidebar').classList.contains('active')
  }
  navigateTo(route: string) {
    this.selectedRoute = route;
  }
}
