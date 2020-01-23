import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoggedInGuard as AuthGuard } from "./guard/logged-in.guard";

import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
  { path: "login", component: LoginComponent, pathMatch: "full" },
  {
    path: "",
    loadChildren: "./layouts/dashboard/dashboard.module#DashboardModule",
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
