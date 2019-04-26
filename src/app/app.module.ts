import { HomeLayoutComponent } from './home/home-layout.component';
import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeRoutingModule } from './home/home.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTableModule, MatCardModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule
  ],
  exports: [
    MatTableModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
