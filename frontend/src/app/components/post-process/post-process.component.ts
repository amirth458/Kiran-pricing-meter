import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-process',
  templateUrl: './post-process.component.html',
  styleUrls: ['./post-process.component.css']
})
export class PostProcessComponent implements OnInit {

  actionbarMenu: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }> = [
      {
        name: 'Profile',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'profile',
        actions: [{ name: 'Add Post-Process', route: 'add' }]
      },
      {
        name: 'Pricing',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'pricing',
        actions: [{ name: 'Add Pricing', route: 'add' }]
      }
    ];
  selectedTab = this.actionbarMenu[0].name;
  constructor() { }

  ngOnInit() {
  }

}
