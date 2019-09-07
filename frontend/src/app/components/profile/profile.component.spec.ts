import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ActionBarComponent } from 'src/app/common/action-bar/action-bar.component';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { SubSectionMenuComponent } from 'src/app/common/sub-section-menu/sub-section-menu.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { FacilityComponent } from '../facility/facility.component';
import { FacilityItemComponent } from '../facility-item/facility-item.component';
import { MachinesComponent } from 'src/app/components/machines/machines.component';
import { MachineItemComponent } from 'src/app/components/machine-item/machine-item.component';
import { PreferencesComponent } from '../preferences/preferences.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { VendorComponent } from 'src/app/components/vendor/vendor.component';
import { PostProcessComponent } from '../post-process/post-process.component';
import { PostProcessPricingComponent } from '../post-process-pricing/post-process-pricing.component';
import { PostProcessProfileComponent } from '../post-process-profile/post-process-profile.component';
import { PostProcessProfileItemComponent } from '../post-process-profile-item/post-process-profile-item.component';
import { ProcessComponent } from 'src/app/components/process/process.component';
import { ProcessProfileComponent } from 'src/app/components/process-profile/process-profile.component';
import { ProcessProfileItemComponent } from 'src/app/components/process-profile-item/process-profile-item.component';
import { ProcessPricingComponent } from '../process-pricing/process-pricing.component';
import { ProcessPricingItemComponent } from '../process-pricing-item/process-pricing-item.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        ActionBarComponent,
        BasicDetailsComponent,
        ColumnSearchFilterComponent,
        FacilityComponent,
        FacilityItemComponent,
        MachinesComponent,
        MachineItemComponent,
        PostProcessComponent,
        PostProcessPricingComponent,
        PostProcessProfileComponent,
        PostProcessProfileItemComponent,
        PreferencesComponent,
        ProcessComponent,
        ProcessPricingComponent,
        ProcessPricingItemComponent,
        ProcessProfileComponent,
        ProcessProfileItemComponent,
        SubSectionMenuComponent,
        VendorComponent
      ],
      imports: [
        AppRoutingModule,
        AgGridModule.withComponents([]),
        FormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
