import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  @Input('selectedMenu') selectedMenu: string;
  @Input('refreshSubmenu') refreshSubmenu;
  @Input('menus') menus: [];
  sidebarClosed = false;

  constructor() { }

  ngOnInit() { }

  toggleSideBar() {
    document.querySelector('#sidebar').classList.toggle('active');
    this.sidebarClosed = !document.querySelector('#sidebar').classList.contains('active')
  }
  navigateTo(route: string) {
    this.selectedMenu = route;
    this.refreshSubmenu();
  }
}
