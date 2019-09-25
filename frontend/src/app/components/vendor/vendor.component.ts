import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  actionbarMenu: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }> = [
      {
        name: 'Basic Details',
        tooltipMessage: 'High level information about your business operations.',
        route: 'basics',
        actions: []
      }
    ];
    
    arrAdditionalMenuItems = [{
      name: 'Facilities',
      tooltipMessage: 'Details regarding specific manufacturing facilities. If you have different individuals quoting for different divisions, create that delineation here',
      route: 'facilities',
      actions: [{ name: 'Add Facility', route: 'add' }]
    },
    {
      name: 'Preferences',
      tooltipMessage: 'Specify the industries you currently support, seek to support, and would rather not support',
      route: 'preferences',
      actions: []
    },
    {
      name: 'Machines',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'machines',
      actions: [{ name: 'Add Machine', route: 'add' }]
    },
    {
      name: 'Shipping',
      tooltipMessage: 'At vero eos et accusamus et',
      route: 'shipping',
      actions: [{ name: 'Add Carrier', route: 'add' }]
    }];
  selectedTab = this.actionbarMenu[0].name;

  constructor(
    private userService:UserService,
    private authService:AuthService,
  ) { }

  ngOnInit() {
    this.authService.getVendor().subscribe(res => {
      this.userService.setVendorInfo(res);
      if(this.userService.getVendorInfo()) {
        this.actionbarMenu.push(...this.arrAdditionalMenuItems);
      } 
    }, error=>{
      console.log('get profile error', error);
    })
  }
}
