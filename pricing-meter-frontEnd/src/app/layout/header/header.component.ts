import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../Shared/AppBaseComponent";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends AppComponentBase implements OnInit {

  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
