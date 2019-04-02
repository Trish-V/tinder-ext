import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { SibilingsCommunicationService } from '../../services/sibilings.communication.service'
import PerfectScrollbar from 'perfect-scrollbar'
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar'

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

  @Input() listOfProfiles: any

  profileDisplayPicture = '../../../assets/icon/avatar.png'

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent



  constructor(private sibilingsCommService: SibilingsCommunicationService) {

    sibilingsCommService.messageAnnounced$.subscribe(msg => {

      this.componentRef.directiveRef.scrollToBottom()

    })

    sibilingsCommService.notificationAnnounced$.subscribe(msg => {
      if (msg.topic == 'pass') {
        var rec = this.listOfProfiles.find(u => u._id == msg.message)

        this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1)

      } else if (msg.topic == 'like') {
        var rec = this.listOfProfiles.find(u => u._id == msg.message)

        this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1)

      }

    })

      // alert(this.listOfProfiles[0])
   

    // this.selectOnClick(this.listOfProfiles[0])

  }

  ngOnInit() {
   
  }

  allowDrop(ev) {
    ev.preventDefault()
  }

  drag(ev, profile) {

    ev.dataTransfer.setData("text", JSON.stringify(profile))

  }
  selectOnClick(profile) {
    this.sibilingsCommService.pushNotification('selectOnClick', profile)
  }


}
