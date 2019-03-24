import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

import { NguCarouselConfig, NguCarousel } from '@ngu/carousel'
import { slider } from './animation'


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

  img1: any
  school = this.profileDataSet.schools[0].name
  job = this.profileDataSet.jobs[0].title.name


  imgags = [
    '../../../assets/sample/sample.png', '../../../assets/sample/sample2.png'
  ]

  @Input() name: string

  public carouselTileItems$: Array<any> = this.imgags

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

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // this.img1 = this.sanitizer.bypassSecurityTrustStyle('url( ' + this.profileDataSet.imgUrl + ' )')
  }

  allowDrop(ev) {
    ev.preventDefault()

  }

  drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id)

  }

  drop(ev) {

    this.dropState = false

    var data = ev.dataTransfer.getData("text")

    this.carouselTileItems$ = []

    this.myCarousel.moveTo(0, false)

    this.profileDataSet = JSON.parse(data)

    console.log(JSON.stringify(this.profileDataSet))
    this.school = this.profileDataSet.schools[0].name
    this.job = this.profileDataSet.jobs[0].title.name
  
    // this.profileDataSet.name = JSON.parse(data).name
    // this.profileDataSet.age = JSON.parse(data).age

    for (var photos of JSON.parse(data).photos) {

      this.carouselTileItems$.push(photos.processedFiles[0].url)
    }

    ev.preventDefault()


  }

  dragenter(ev) {

    this.dropState = (String(ev.target.className).trim() === 'tile') ? true : this.dropState;

    ev.preventDefault();

  }

  dragleave(ev) {
    this.dropState = (String(ev.target.className).trim() === 'tile') ? false : this.dropState;

    ev.preventDefault();

  }

  like() {
    this.stateLike = true
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

  }
  pass() {
    this.stateDislike = true

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
  }

}
