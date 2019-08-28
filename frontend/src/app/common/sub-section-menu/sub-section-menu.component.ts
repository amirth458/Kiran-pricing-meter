import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-section-menu',
  templateUrl: './sub-section-menu.component.html',
  styleUrls: ['./sub-section-menu.component.css']
})
export class SubSectionMenuComponent implements OnInit {

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
  selectedRoute = '#home';
  constructor() { }

  ngOnInit() {
  }

  setSelectedRoute(route) {
    this.selectedRoute = route;
  }
}
