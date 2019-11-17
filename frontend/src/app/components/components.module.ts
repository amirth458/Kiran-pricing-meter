import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';
import { DropdownCellRendererComponent } from '../common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { DropdownHeaderRendererComponent } from '../common/dropdown-header-renderer/dropdown-header-renderer.component';
import { MultiSelectCellEditorComponent } from '../common/multi-select-cell-editor/multi-select-cell-editor.component';
import { MultiSelectCellRendererComponent } from '../common/multi-select-cell-renderer/multi-select-cell-renderer.component'
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';

import { ActiveRfqComponent } from './vendor/active-rfq/active-rfq.component';
import { ArchivedRfqComponent } from './vendor/archived-rfq/archived-rfq.component';
import { BasicRfqComponent } from './vendor/basic-rfq/basic-rfq.component';
import { PartItemComponent } from './vendor/part-item/part-item.component';
import { ProgramContainerComponent } from './vendor/program-container/program-container.component';
import { ProgramOverviewComponent } from './vendor/program-overview/program-overview.component';
import { ProjectProfileComponent } from './vendor/project-profile/project-profile.component';
import { RfqContainerComponent } from './vendor/rfq-container/rfq-container.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    DropdownCellRendererComponent,
    DropdownHeaderRendererComponent,
    MultiSelectCellEditorComponent,
    MultiSelectCellRendererComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ProgressBarComponent,

    ActiveRfqComponent,
    ArchivedRfqComponent,
    BasicRfqComponent,
    PartItemComponent,
    ProgramContainerComponent,
    ProgramOverviewComponent,
    ProjectProfileComponent,
    RfqContainerComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      DropdownCellRendererComponent,
      DropdownHeaderRendererComponent,
      MultiSelectCellRendererComponent,
      MultiSelectCellEditorComponent
    ]),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule,
    InternationalPhoneNumberModule,
  ],
  exports: [
    NgxSpinnerModule,
    AgGridModule,

    ActionBarComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    MultiSelectCellRendererComponent,
    ProgressBarComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
  ]
})
export class ComponentsModule { }
