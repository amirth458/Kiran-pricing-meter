import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {
  @Input('menus') menus: [{ name: string, route: string }];
  @Input('selectedTab') selectedTab: string;
  constructor() { }

  ngOnInit() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });

  }

  selectTab(tab) {
    this.selectedTab = tab;
  }
}
