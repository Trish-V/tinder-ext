import { Component, OnInit, Input } from '@angular/core';
import { SibilingsCommunicationService } from '../services/sibilings.communication.service';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {
  
  @Input() listOfProfiles: any;
  
  constructor(sibilingsCommService: SibilingsCommunicationService) {

    sibilingsCommService.messageAnnounced$.subscribe(msg => {
    
      let scrollView = document.getElementById('list');
    
      const ps = new PerfectScrollbar(scrollView);
    
      scrollView.scrollTop = scrollView.scrollHeight;
    
      ps.update();

    
    });
  
  }

  ngOnInit() {
  }

}
