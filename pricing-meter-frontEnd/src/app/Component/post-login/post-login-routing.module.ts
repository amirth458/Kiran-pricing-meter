import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardGuard} from "../../auth-guard.guard";
import {AddPropertyComponent} from "./add-property/add-property.component";
import {PropertyListComponent} from "./property-list/property-list.component";
import {UploadPropertyComponent} from "./add-property/upload-property/upload-property.component";
import {UploadCsvComponent} from "./add-property/upload-csv/upload-csv.component";


const routes: Routes = [
  {
    path: 'pricing-meter',
    canActivate: [AuthGuardGuard],
    children: [
      {
        path: 'add-property',
        component: AddPropertyComponent
      },
      {
        path: 'property-list',
        component: PropertyListComponent
      },
      {
        path: 'add-property/review',
        component: UploadPropertyComponent
      },
      {
        path: 'add-property/csv',
        component: UploadCsvComponent
      }

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule { }
