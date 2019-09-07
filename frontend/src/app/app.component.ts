import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  menus: Array<{ name: string, route: string, icon: string }> = [
    {
      name: 'Program',
      route: '/program',
      icon: 'far fa-file-alt'
    },
    {
      name: 'Profile',
      route: '/profile',
      icon: 'far fa-user-circle'
    },
    {
      name: 'Fleet Control',
      route: '/fleet',
      icon: 'fas fa-wrench'
    },
    {
      name: 'Material Inventory',
      route: '/material',
      icon: 'fas fa-dolly-flatbed'
    },
    {
      name: 'Insight',
      route: '/insight',
      icon: 'far fa-chart-bar'
    },
    {
      name: 'Setting',
      route: '/setting',
      icon: 'fas fa-cogs'
    }
  ];
  selectedMenu = '/profile';
  sideMenuOpen = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }
}
