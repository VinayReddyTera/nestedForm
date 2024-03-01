import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PhoneFormComponent } from './phone-form/phone-form.component';
import { AddressFormComponent } from './address-form/address-form.component';

@NgModule({
  declarations: [PhoneFormComponent, AddressFormComponent,AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    NgxMatSelectSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
