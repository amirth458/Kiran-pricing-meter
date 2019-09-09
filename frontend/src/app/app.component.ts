import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


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
