import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UrlGuard } from './url-guard.guard';
import { CrudContainerComponent } from './crud-container/crud-container.component';
import { WildcardRouteComponent } from './wildcard-route/wildcard-route.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app-login',
  },

  {
    path: 'app-crud-container',
    component: CrudContainerComponent,
    canActivate: [UrlGuard],
  },
  { path: 'app-login', component: LoginComponent },
  { path: '**', component: WildcardRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
