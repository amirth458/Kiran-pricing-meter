import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-section-menu',
  templateUrl: './sub-section-menu.component.html',
  styleUrls: ['./sub-section-menu.component.css']
})
export class SubSectionMenuComponent implements OnInit {
  @Input('submenus') submenus: [{ name: string; route: string }];
  @Input('selectedMenu') selectedMenu: string;
  constructor(public route: Router) {}

  ngOnInit() {
    const urlArray = this.route.url.split('/');
    if (urlArray.length > 2) {
      this.selectedMenu = `${urlArray[1]}/${urlArray[2]}`;
    }
  }

  setSelectedRoute(route) {
    this.selectedMenu = route;
    this.route.navigateByUrl(route);
  }
}
