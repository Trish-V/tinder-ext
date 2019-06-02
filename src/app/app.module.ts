import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ProfileCardComponent } from './home/profile-card/profile-card.component'
import { TimeLineComponent } from './home/time-line/time-line.component'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { HttpClientModule } from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'



import { TinderAPIService } from './services/tinder-api.service'
import { SibilingsCommunicationService } from './services/sibilings.communication.service'
import { NguCarouselModule } from '@ngu/carousel'
import { HomeComponent } from './home/home.component'
import { SettingsComponent } from './settings/settings.component' 
import { MaterialCDKModule } from './_material/cdk/material.cdk.module'
import { FormsModule } from '@angular/forms'
import { CupidoAPIService } from './services/cupido-api.service'; 
import { ChromeStorageService } from './services/chrome-storage.service';
import { HistoryComponent } from './history/history.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}



@NgModule({
  declarations: [
    AppComponent,
    ProfileCardComponent,
    TimeLineComponent,
    HomeComponent,
    SettingsComponent,
    HistoryComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PerfectScrollbarModule,
    HttpClientModule,
    NguCarouselModule,
    BrowserAnimationsModule,
    MaterialCDKModule,
    FormsModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
    TinderAPIService,
    SibilingsCommunicationService,
    CupidoAPIService,
    ChromeStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
