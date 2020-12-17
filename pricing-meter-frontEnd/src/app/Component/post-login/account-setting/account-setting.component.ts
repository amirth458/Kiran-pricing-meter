import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../Shared/AppBaseComponent';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent extends AppComponentBase implements OnInit {
  public companyLogo: any;
  public brokerageLogo: any;
  public file: string;
  constructor(inject: Injector) {
    super(inject);
  }

  ngOnInit(): void {
    this.companyLogo = 'assets/img/noimage.jpg';
    this.brokerageLogo = 'assets/img/noimage.jpg';
  }
  onSelectCompanyLogo(event): void {
    if (!event.target.files[0].type.includes('image')) {
    } else {
      const reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (fileEvent: any) => {
        this.companyLogo = fileEvent.target.result;
      };
    }
  }
  onSelectBrokerageLogo(event): void {
    if (!event.target.files[0].type.includes('image')) {
    } else {
      const reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (fileEvent: any) => {
        this.brokerageLogo = fileEvent.target.result;
      };
    }
  }

  removeCompanyLogo() {
    this.companyLogo = 'assets/img/noimage.jpg';
  }

  removeBrokerLogo() {
    this.brokerageLogo = 'assets/img/noimage.jpg';
  }
}
