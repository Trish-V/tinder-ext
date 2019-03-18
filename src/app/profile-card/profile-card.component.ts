import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input()   profileDataSet = {

    name: '',

    age: '',

    distance: '',

    imgUrl: '',

    studies: ''

  };
  
  img1: any;
  
  constructor(private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    // alert(JSON.parse(this.profileDataSet));


    this.img1 = this.sanitizer.bypassSecurityTrustStyle('url( '+ this.profileDataSet.imgUrl + ' )');

  }

}
