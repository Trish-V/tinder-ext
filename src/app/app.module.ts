import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { TinderAPI } from './services/tinder.message.retrival.service';
import { SibilingsCommunicationService } from './services/sibilings.communication.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};



@NgModule({
  declarations: [
    AppComponent,
    ProfileCardComponent,
    TimeLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PerfectScrollbarModule,
    HttpClientModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
    TinderAPI,
    SibilingsCommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
