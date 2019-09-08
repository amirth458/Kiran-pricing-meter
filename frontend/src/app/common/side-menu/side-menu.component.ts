import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  @Input('selectedMenu') selectedMenu: string;
  @Input('menuOpen') menuOpen;
  @Input('menus') menus: Array<{ name: string, route: string, icon: string }>;

  @Output() public toggleMenuStatus: EventEmitter<boolean> = new EventEmitter();

  sidemenuClosed = false;

  constructor() { }

  ngOnInit() {
    if (this.menuOpen) {
      if (!document.querySelector('#sidebar').classList.contains('active')) {
        document.querySelector('#sidebar').classList.toggle('active');
      }
    } else {
      if (document.querySelector('#sidebar').classList.contains('active')) {
        document.querySelector('#sidebar').classList.toggle('active');
      }
    }
  }

  toggleSideBar() {
    document.querySelector('#sidebar').classList.toggle('active');
    this.sidemenuClosed = !document.querySelector('#sidebar').classList.contains('active');
    this.menuOpen = !this.sidemenuClosed;
    this.toggleMenuStatus.emit(this.menuOpen);
  }
  navigateTo(route: string) {
    if (route.includes('profile')) {
      this.selectedMenu = route;
    }
  }
}
