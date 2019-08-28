import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-column-search-filter',
  templateUrl: './column-search-filter.component.html',
  styleUrls: ['./column-search-filter.component.css'],
})
export class ColumnSearchFilterComponent implements OnInit {
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
  sidemenuClosed = false;

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

  actionbarMenu = [
    {
      name: 'Basic Details',
      tooltipMessage: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum '
    },
    {
      name: 'Facilities',
      tooltipMessage: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum '
    },
    {
      name: 'Preferences',
      tooltipMessage: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum '
    },
    {
      name: 'Machines',
      tooltipMessage: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum '
    },
    {
      name: 'Shipping',
      tooltipMessage: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum '
    }
  ]
  selectedTab = this.actionbarMenu[0].name;

  constructor() { }

  ngOnInit() {
  }

  getSubmenu() {
    const activeMenu = this.menus.filter(x => x.route === this.selectedMenu)[0];
    this.submenu = activeMenu.submenu;
    return activeMenu.submenu;
  }

  changeToggleState() {
    this.sidemenuClosed = !this.sidemenuClosed;
  }
}
