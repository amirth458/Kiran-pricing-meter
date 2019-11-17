import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { ActiveRfqComponent } from 'src/app/components/vendor/active-rfq/active-rfq.component';
import { ArchivedRfqComponent } from 'src/app/components/vendor/archived-rfq/archived-rfq.component';
import { BasicRfqComponent } from 'src/app/components/vendor/basic-rfq/basic-rfq.component';

import { ProgramContainerComponent } from 'src/app/components/vendor/program-container/program-container.component';
import { ProgramOverviewComponent } from 'src/app/components/vendor/program-overview/program-overview.component';
import { ProjectProfileComponent } from 'src/app/components/vendor/project-profile/project-profile.component';
import { RfqContainerComponent } from 'src/app/components/vendor/rfq-container/rfq-container.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'program', component: ProgramContainerComponent,
        children: [
          {
            path: 'overview', component: ProgramOverviewComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'basics' },
              { path: '**', pathMatch: 'full', redirectTo: 'basics' }
            ]
          },
          {
            path: 'rfq', component: RfqContainerComponent,
            children: [
              { path: 'active', pathMatch: 'full', component: ActiveRfqComponent },
              { path: 'active/add', pathMatch: 'full', component: ProjectProfileComponent },
              { path: 'active/add/basic', pathMatch: 'full', component: BasicRfqComponent },
              { path: 'archived', component: ArchivedRfqComponent },
              { path: 'archived/add', pathMatch: 'full', component: ProjectProfileComponent },
              { path: 'archived/add/basic', pathMatch: 'full', component: BasicRfqComponent },
              { path: '', pathMatch: 'full', redirectTo: 'basics' },
              { path: '**', pathMatch: 'full', redirectTo: 'basics' }
            ]
          },
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: '**', redirectTo: 'overview', pathMatch: 'full' }
        ],
      },
      { path: '', redirectTo: 'program', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
