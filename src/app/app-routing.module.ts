import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UrlGuard } from './url-guard.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app-home',
  },
  { path: 'app-home', component: HomeComponent },
  { path: 'app-form', component: FormComponent, canActivate: [UrlGuard] },
  { path: 'app-login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
