import { Component, OnInit } from '@angular/core';
import { ChromeStorageService } from '../services/chrome-storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history
  constructor(
    private chromeStorageService: ChromeStorageService) { }

  ngOnInit() {
    this.chromeStorageService.getItem('history', res => {
      this.history = res.history
      // console.log(JSON.stringify(res.history,null,4))
    })

  }

}
