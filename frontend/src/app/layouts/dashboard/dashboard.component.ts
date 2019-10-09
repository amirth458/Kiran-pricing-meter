import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/service/auth.service';

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const auth = this.authService.getAuthData();
    if (auth.is_admin) {
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
