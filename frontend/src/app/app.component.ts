import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  submenu = [];
  submenus = [
    {
      name: 'Home',
      route: '#home'
    },
    {
      name: 'Vendor',
      route: '#vendor'
    },
    {
      name: 'Processes',
      route: '#processes'
    },
    {
      name: 'Post-Processes',
      route: '#post-processes'
    }
  ];
  selectedSubmenu = '#home';

  menus = [
    {
      name: 'Program',
      route: '#program',
      icon: 'far fa-file-alt',
      submenu: this.submenus
    },
    {
      name: 'Profile',
      route: '#profile',
      icon: 'far fa-user-circle',
      submenu: []
    },
    {
      name: 'Fleet Control',
      route: '#fleet',
      icon: 'fas fa-wrench',
      submenu: []
    },
    {
      name: 'Material Inventory',
      route: '#material',
      icon: 'fas fa-dolly-flatbed',
      submenu: []
    },
    {
      name: 'Insight',
      route: '#insight',
      icon: 'far fa-chart-bar',
      submenu: []
    },
    {
      name: 'Setting',
      route: '#setting',
      icon: 'fas fa-cogs',
      submenu: this.submenu,
    }
  ];
  selectedMenu = '#profile';

  getSubmenu() {
    const activeMenu = this.menus.filter(x => x.route === this.selectedMenu)[0];
    this.submenu = activeMenu.submenu;
    return activeMenu.submenu;
  }
}
