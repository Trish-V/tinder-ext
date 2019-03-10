import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SibilingsCommunicationService } from '../services/sibilings.communication.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {
  
  @Input() listOfProfiles: any;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  
  constructor(sibilingsCommService: SibilingsCommunicationService) {

    sibilingsCommService.messageAnnounced$.subscribe(msg => { 

      this.componentRef.directiveRef.scrollToBottom();
    
    });
  
  }

  ngOnInit() {
  }

}
