import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
declare var getChrome: any;
declare var getDOM: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  profileDataSet: any;

  ngOnInit(): void {
    // window.resizeTo(680,400);

    getChrome().tabs.getSelected(null, function (tab) {
      var tablink = tab.url;
      if (tablink.includes('tinder.com')){
        alert('welcome')
      }else{
        alert('It\'s not tinder');
      }
      // alert(tablink);
    });


    getChrome().runtime.onMessage.addListener(function (request, sender) {
      if (request.action == "getSource") { // callback for liked recomendations
        alert(request.source);
        this.profileDataSet = request.source;
        // message.innerText = request.source;
      }
      if (request.action == "getLocalStorage") {
        alert(JSON.stringify(request.source));// callback for local storage
      }
    });


  }
  title = 'TinderBudExt';

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