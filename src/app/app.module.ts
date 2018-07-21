import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersistenceModule } from 'angular-persistence';

import { AppComponent } from './app.component';
import { SlideOutSidebarComponent } from './slide-out-sidebar/slide-out-sidebar.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SlideOutSidebarComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    PersistenceModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
