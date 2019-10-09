import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  menus: Array<{ name: string, route: string, icon: string, visible: boolean, active: boolean }> = [];
  selectedMenu = '/profile';
  sideMenuOpen = true;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    const user = this.userService.getUserInfo();
    if (user.is_admin) {
      this.menus = environment.admin_menus;
      this.selectedMenu = '/admin';
    } else {
      this.menus = environment.menus;
      this.selectedMenu = '/profile';
    }
  }

  toggleMenuStatus(value: boolean) {
    this.sideMenuOpen = value;
  }
}
