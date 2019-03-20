import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../environments/environment';
import { SibilingsCommunicationService } from './services/sibilings.communication.service';
import { TinderAPI } from './services/tinder.message.retrival.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { async } from '@angular/core/testing';

declare var getChrome: any;

declare var openTinder: any;

declare var Swal: any;

declare var Toast: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void { 
    
  }
  constructor(){

  }
 
}