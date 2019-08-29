import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ProfileComponent } from './component/profile/profile.component';

const routes: Routes = [

  {
    path: 'profile', component: ProfileComponent
  },
  {
    path: '**', redirectTo: 'profile'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
