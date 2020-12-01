import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from "../../../Shared/AppBaseComponent";
import {LoginDialogComponent} from "../../agent/login-dialog/login-dialog.component";
import {CommonDialogBoxComponent} from "../../../Shared/common-dialog-box/common-dialog-box.component";

@Component({
  selector: 'app-edit-subscription',
  templateUrl: './edit-subscription.component.html',
  styleUrls: ['./edit-subscription.component.scss']
})
export class EditSubscriptionComponent extends AppComponentBase implements OnInit {

  public option = false;
  public active = 'teams';
  public packageList = {
    basic: ['3 properties', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],
    advanced: ['10 properties', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],
    unlimited: ['3 properties', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],
    team: ['50 properties', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],
    agency: ['100 properties', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],
    enterprise: ['Unlimited', 'One User Profile', 'Unlimited Reports', 'Customized Agent Page'],

  };

  constructor(inject: Injector ) {
    super(inject);
  }

  ngOnInit(): void {
  }

  getClass(button: string): any {
    if (button === 'indivual') {
      return this.option ? 'btn-active' : 'tab-btn';
    } else {
      return this.option ? 'tab-btn' : 'btn-active';
    }
  }

  activate(part: string): void {
    const dialogRef = this.dialog.open( CommonDialogBoxComponent,
      {
        data: {action: 'activate'},
        height: '200px',
        width: '800px'
        });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.active = part;
      }
    });
  }

}
