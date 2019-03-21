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

  @ViewChild('myCarousel') myCarousel:any

  stateLike = false

  stateDislike = false

  @Input() profileDataSet = {

    name: '',

    age: '',

    distance: '',

    imgUrl: '',

    studies: ''

  }

  img1: any


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
    this.img1 = this.sanitizer.bypassSecurityTrustStyle('url( ' + this.profileDataSet.imgUrl + ' )')
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

this.myCarousel.moveTo(0,false)
    for (var photos of JSON.parse(data).photos) {

      this.carouselTileItems$.push(photos.processedFiles[0].url)
    }

    ev.preventDefault()


  }

  dragenter(ev) {
    if (String(ev.target.className).trim() === 'tile') {
      this.dropState = true;
      console.log('changing state drag enter')
    }
    ev.preventDefault();
    // alert(ev.target.className )
    // this.dropState = (ev.target.className === 'tile') ? true : this.dropState

    console.log('dragenter ' + ev.target.className + ' ' + this.dropState)
  }

  dragleave(ev) {
    if (String(ev.target.className).trim() === 'tile') {
      this.dropState = false;
      console.log('changing state drag leave')
    }
    ev.preventDefault();

    // this.dropState = (ev.target.className === 'tile') ? false : this.dropState



    console.log('dragleave ' + ev.target.className + ' ' + this.dropState)
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
