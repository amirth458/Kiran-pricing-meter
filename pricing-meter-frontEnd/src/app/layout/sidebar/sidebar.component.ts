import {Component, Injector, OnInit, Renderer2} from '@angular/core';
import {AppComponentBase} from "../../Shared/AppBaseComponent";


  @Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends AppComponentBase implements OnInit {

  public sidebarItems: any[];
  constructor(private inject: Injector, private renderer: Renderer2) {
    super(inject);
  }

  ngOnInit(): void {
    this.sidebarItems = [
      {
      path: '/pricing-meter/add-property',
      title: 'Add Property',
      active: 'assets/img/add-property-active.svg',
      nonActive: 'assets/img/add-property-nonactive.svg',
    },
    {
        path: '/pricing-meter/property-list',
        title: 'Property List',
        active: 'assets/img/active-property-list.svg',
        nonActive: 'assets/img/non-active-property-list.svg',
    }
    ];
  }

  navigatePath(path): void {
    this.router.navigate([path]);
  }
  // callMenuToggle = (event: any, element: any) => {
  //   if (element === this.showMenu) {
  //     this.showMenu = '0';
  //   } else {
  //     this.showMenu = element;
  //   }
  //   const hasClass = event.target.classList.contains('toggled');
  //   if (hasClass) {
  //     this.renderer.removeClass(event.target, 'toggled');
  //   } else {
  //     this.renderer.addClass(event.target, 'toggled');
  //   }
  // };

    activePath(path): boolean {
    return window.location.pathname.includes(path);
    }
}
