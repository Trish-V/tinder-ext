import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from './animation';
import { Observable, interval } from 'rxjs';


import { startWith, take, map } from 'rxjs/operators';
@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnInit {
  @Input() profileDataSet = {

    name: '',

    age: '',

    distance: '',

    imgUrl: '',

    studies: ''

  };

  img1: any;


  imgags = [
    '../../assets/sample/sample.png', '../../assets/sample/sample2.png', '../../assets/sample/sample3.png'
  ];

  @Input() name: string;

  public carouselTileItems$: Array<any> = this.imgags;
  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 5, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 5000 },
    animation: 'lazy'
  };
  tempData: any[];


  public carouselTiles = {
    0: [],
    1: [],
    2: [],

  };

  dropState = false;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // alert(JSON.parse(this.profileDataSet));


    this.img1 = this.sanitizer.bypassSecurityTrustStyle('url( ' + this.profileDataSet.imgUrl + ' )');


  }
  carouselTileLoad(j: any): any {

    const len = this.carouselTiles[j].length;

    for (let i = 0; i < len; i++) {
      this.carouselTiles[j].push(
        this.imgags[i]
      );
    }
  }
  allowDrop(ev) {
    ev.preventDefault();

  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    alert(data)
    // ev.target.appendChild(document.getElementById(data));
  }
  draggedEnterData = '';
  dragenter(ev) {
    ev.preventDefault();
    if (   ev.target.className === 'tile' ) {

      this.dropState = true;
    }
  }

  dragleave(ev) {
    ev.preventDefault(); 
    if (   ev.target.className === 'tile'  ) {

      this.dropState = false;
    }
  }
}
