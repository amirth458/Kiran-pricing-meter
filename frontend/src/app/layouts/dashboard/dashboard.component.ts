import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menus: Array<{ name: string, route: string, icon: string, visible: boolean, active: boolean }> = environment.menus;
  selectedMenu = '/profile';
  sideMenuOpen = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }
}
