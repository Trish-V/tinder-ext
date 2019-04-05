import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

import { NguCarouselConfig, NguCarousel } from '@ngu/carousel'
import { slider } from './animation'
import { TinderAPI } from 'src/app/services/tinder.message.retrival.service';
import { SibilingsCommunicationService } from 'src/app/services/sibilings.communication.service';


declare var Swal: any

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnInit {

  @ViewChild('myCarousel') myCarousel: any

  stateLike = false

  stateDislike = false

  @Input() profileDataSet =
    {
      _id: '',
      name: '',
      age: '',
      schools: [
        {
          // id: '',
          name: ''
        }
      ],
      distance_mi: 0,
      jobs: [
        {
          title: {
            name: ''
          }
        }

      ]
    }

  backUpProfileDataSet =
    {
      _id: '',
      name: '',
      age: '',
      schools: [
        {
          // id: '',
          name: ''
        }
      ],
      distance_mi: 0,
      jobs: [
        {
          title: {
            name: ''
          }
        }

      ]
    }

  school = this.profileDataSet.schools[0].name

  job = this.profileDataSet.jobs[0].title.name

  placeHolderImages = [
    '../../../assets/images/placeholder.jpg',
    '../../../assets/images/placeholder.jpg'
  ]

  @Input() name: string

  public carouselTileItems$: Array<any> = this.placeHolderImages

  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 3000 },
    animation: 'lazy'
  }

  tempData: any[]

  dropState = false

  private recId = ''

  constructor(
    private sanitizer: DomSanitizer,
    private tinderAPI: TinderAPI,
    private sibilingsCommService: SibilingsCommunicationService
  ) {

    
  }

  ngOnInit() {
    this.school = '000'
    this.job = '000'
    this.profileDataSet.distance_mi = 0

    this.myCarousel.moveTo(1, false)

    this.sibilingsCommService.notificationAnnounced$.subscribe(msg => {
      if (msg.topic == 'pass' || msg.topic == 'like') {

        this.carouselTileItems$ = this.placeHolderImages

        this.profileDataSet = this.backUpProfileDataSet

        this.school = '000'
        this.job = '000'
        this.profileDataSet.distance_mi = 0

        this.myCarousel.moveTo(0, false)

      }
      if (msg.topic == 'selectOnClick') {
        this.carouselProfileSetup('selectOnClick', null, msg.message)
      }
      if (msg.topic == 'initialProfile') {
        this.carouselProfileSetup('initialProfile', null, msg.message)
        
      }

    })
  }

  allowDrop(ev) {
    ev.preventDefault()

  }

  drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id)

  }

  drop(ev) {

    this.carouselProfileSetup('drag', ev, null)

  }

  dragenter(ev) {

    this.dropState = (String(ev.target.className).trim().includes('tile')) ? true : this.dropState;

    ev.preventDefault();

  }

  dragleave(ev) {
    this.dropState = (String(ev.target.className).trim().includes('tile')) ? false : this.dropState;

    ev.preventDefault();

  }

  like() {
    this.stateLike = true

    this.stateDislike = true

    this.serviceLikeImpl(this.profileDataSet._id);

  }
  pass() {
    this.stateDislike = true

    this.stateLike = true

    this.servicePassImpl(this.profileDataSet._id);

  }

  serviceLikeImpl(recID) {

    var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

    this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

    this.tinderAPI.services.like(recID).subscribe(res => {

      this.sibilingsCommService.pushNotification('like', recID)

      const Toast = Swal.mixin({
        toast: true,

        position: 'top-end',

        showConfirmButton: false,

        timer: 3000

      })

      Toast.fire({
        type: 'success',

        title: 'Liked'

      })
    })
  }
  servicePassImpl(recID) {

    var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

    this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

    this.tinderAPI.services.pass(recID).subscribe(res => {

      this.sibilingsCommService.pushNotification('pass', recID)

      const Toast = Swal.mixin({
        toast: true,

        position: 'top-end',

        showConfirmButton: false,

        timer: 3000

      })

      Toast.fire({
        type: 'error',

        title: 'Disliked'

      })
    })
  }

  carouselProfileSetup(type: String, ev, dataPayLoadOfProfile) {

    this.stateLike = false

    this.stateDislike = false

    this.dropState = false

    var data;

    if (type == 'drag') {

      data = ev.dataTransfer.getData("text")

      ev.preventDefault()

    } else if (type == 'selectOnClick' || type == 'initialProfile') {

      data = JSON.stringify(dataPayLoadOfProfile)

    }

    this.carouselTileItems$ = [] 

    this.profileDataSet = JSON.parse(data)  

    this.school = this.profileDataSet.schools[0].name

    this.job = this.profileDataSet.jobs[0].title.name

    for (var photos of JSON.parse(data).photos) {

      this.carouselTileItems$.push(photos.processedFiles[0].url)
    }


    this.myCarousel.moveTo(0, false)

  }

}
