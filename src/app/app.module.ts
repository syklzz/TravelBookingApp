import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripsComponent } from './trips/trips.component';
import { FilterPipe } from './trips/filter.pipe';
import { FormComponent } from './form/form.component';
import { BasketComponent} from './basket/basket.component';
import { FilterComponent } from './filter/filter.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { EditionComponent } from './edition/edition.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from "@angular/fire/auth";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TripsDetailsComponent } from './trips-details/trips-details.component';


@NgModule({
  declarations: [
    AppComponent,
    TripsComponent,
    FilterPipe,
    FormComponent,
    BasketComponent,
    FilterComponent,
    TripsDetailsComponent,
    LoginComponent,
    RegisterComponent,
    SettingsComponent,
    EditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
