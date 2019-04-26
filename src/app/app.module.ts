import { NgModule } from '@angular/core';
import { MatGridListModule, MatDialogModule, MatButtonModule, MatCardModule, MatTableModule, MatTabsModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeLayoutComponent } from './home/home-layout.component';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home/home.routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, HomeComponent, HomeLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [MatGridListModule, MatButtonModule, MatDialogModule, MatTableModule, MatCardModule, MatTabsModule, MatIconModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
