import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ActionBarComponent } from 'src/app/common/action-bar/action-bar.component';
import { SubSectionMenuComponent } from 'src/app/common/sub-section-menu/sub-section-menu.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { FacilityComponent } from '../facility/facility.component';
import { PreferencesComponent } from '../preferences/preferences.component';
import { FormsModule } from '@angular/forms';
import { ColumnSearchFilterComponent } from 'src/app/common/column-search-filter/column-search-filter.component';
import { AgGridModule } from 'ag-grid-angular';

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
        PreferencesComponent,
        SubSectionMenuComponent
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
