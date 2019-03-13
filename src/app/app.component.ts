import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../environments/environment';
import { SibilingsCommunicationService } from './services/sibilings.communication.service'; 
import { TinderAPI } from './services/tinder.message.retrival.service';

declare var getChrome: any; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Input()
  profileDataSet = {

    name: '',
    
    age: '',
    
    distance: '',
    
    imgUrl: '',
    
    studies: ''
  
  };

  listOfProfiles = []; 
  
  constructor(public sibilingsCommService: SibilingsCommunicationService, tinderAPI: TinderAPI) {
  
    const context = this;

 
 
    getChrome().tabs.getSelected(null, function (tab) {
 
      var tablink = tab.url;
 
      if (tablink.includes('tinder.com')) {
 
        // alert('welcome')
 
      } else {
 
        // alert('It\'s not tinder');
 
      }
 
    });


    getChrome().runtime.onMessage.addListener(function (request, sender) {
 
      if (request.action == "getSource") { // callback for liked recomendations 
 
        context.profileDataSet = JSON.parse(request.source);

        alert('context.profileDataSet');
 
        context.listOfProfiles.push(context.profileDataSet);
 
        // context.sibilingsCommService.pushMessage('scrollTop'); 
 
      }
 
      if (request.action == "getLocalStorage") {
 
        alert(request.source);// callback for local storage
 
      }
 
    });

  }
  ngOnInit(): void {
    // window.resizeTo(680,400);

  }
  

  popUp() { // popup window
  
    getChrome().tabs.create({
  
      url: getChrome().extension.getURL('index.html'),
  
      active: false
  
    }, function (tab) {
  
      getChrome().windows.create({
  
        tabId: tab.id,
  
        type: 'popup',
  
        focused: true
  
      });
  
    });
  
  }

  likeAll() {
  
    getChrome().tabs.executeScript(null, { // injecting retriving dom
  
      file: "assets/chromejs/getDom.js"
  
    }, function () {
  
      if (getChrome().runtime.lastError) {
  
        // message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
  
      }
  
    });

  }

  likeWithInterval() {
  
    alert(JSON.stringify(this.profileDataSet));
  
  }

  feelingLucky() {

  }
  testLocalStorage() {// injecting localstorage script
  
    alert('local');

    getChrome().tabs.executeScript(null, {
  
      file: "assets/chromejs/localstorage.js"
  
    }, function () {
  
      if (getChrome().runtime.lastError) {
  
      }
  
    });
  
  }

}