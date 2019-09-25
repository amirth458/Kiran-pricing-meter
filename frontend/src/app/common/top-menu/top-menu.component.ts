import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/service/vendor.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  userInfo = {
    name: 'Cullen Hilkene',
    img: 'assets/image/avatar3.png'
  };
  constructor(
    public router: Router,
    public authService: AuthService,
    public vendorService: VendorService,
    public userService: UserService
  ) {

  }

  ngOnInit() {
    if(this.userService.getVendorInfo()) {
      this.vendorService.getVendorDetail(this.userService.getUserInfo().id).subscribe(res => {
        if (res) {
          this.userInfo = { ...this.userInfo, ...res };
        }
      });
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
