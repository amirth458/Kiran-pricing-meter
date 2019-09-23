import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private authService:AuthService
  ) {
    
  }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
