import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { BasketComponent } from './basket/basket.component';
import { EditionComponent } from './edition/edition.component';
import { FormComponent } from './form/form.component';
import { AuthGuard } from './guard/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { TripsDetailsComponent } from './trips-details/trips-details.component';
import { TripsComponent } from './trips/trips.component';

const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'trips', component: TripsComponent},
  { path: 'trips/add', component: FormComponent, canActivate:[AuthGuard], data: {expectedRole: 'worker'}},
  { path: 'basket', component: BasketComponent, canActivate:[AuthGuard], data: {expectedRole: 'reader'}},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'trips/details/:id', component: TripsDetailsComponent},
  { path: 'trips/edit/:id', component: EditionComponent, canActivate:[AuthGuard], data: {expectedRole: 'worker'}},
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuard], data: {expectedRole: 'admin'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
