import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../environments/environment'
import { SibilingsCommunicationService } from './services/sibilings.communication.service'
import { TinderAPI } from './services/tinder.message.retrival.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { async } from '@angular/core/testing'

declare var getChrome: any

declare var openTinder: any

declare var Swal: any

declare var Toast: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  profileDisplayPicture = '../assets/icon/avatar.png'
  username = 'loading...'

  @Input()
  profileDataSet = {

    name: '',

    age: '',

    distance: '',

    imgUrl: '',

    studies: ''

  }

  listOfProfiles = []
  static context



  ngOnInit(): void {
  }



  constructor(
    public sibilingsCommService: SibilingsCommunicationService,
    private tinderAPI: TinderAPI,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    console.log('started')

    AppComponent.context = this

    getChrome().tabs.getSelected(null, function (tab) {

      var tablink = tab.url

      if (tablink.includes('tinder.com')) {

        getChrome().tabs.executeScript(null, { // injecting retriving dom

          file: "assets/chromejs/localstorage.js"

        }, function () {

          if (getChrome().runtime.lastError) {
            // alert('error')
          }

        })


      }

    })

    let thisContext = this
    getChrome().runtime.onMessage.addListener(function (request, sender) {
      if (request.action == "savedLocalStorage") {
        // callback for local storage 
        thisContext.saveLocalStorage('tinder_local_storage', request.source)

      }
      if (request.action == "getLocalStorage") {

        localStorage.setItem('tinder_local_storage', request.source)

      }

    })


    try {
      this.setUserProfile()

    } catch (error) {

      this.openAlertToReLogUser()
    }

  }

  setUserProfile() {
    var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

    this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

    this.tinderAPI.services.get_profile_of_the_logged_in_user().subscribe(res => {

      this.profileDisplayPicture = res.photos[0].url

      this.username = res.name

      const Toast = Swal.mixin({
        toast: true,

        position: 'top-end',

        showConfirmButton: false,

        timer: 3000

      })

      Toast.fire({
        type: 'success',

        title: 'Signed in successfully'

      })

      // console.log(res.photos[0].url)
    }, err => {
      if (err.status) {
        console.log('No Access ' + err.status)
        this.openAlertToReLogUser()

      }

    })
  }





  likeAll() {



  }

  likeWithInterval() {

    alert(JSON.stringify(this.profileDataSet))

  }

  feelingLucky() {

  }
  testLocalStorage() {// injecting localstorage script

    alert('local')

    getChrome().tabs.executeScript(null, {

      file: "assets/chromejs/localstorage.js"

    }, function () {

      if (getChrome().runtime.lastError) {

      }

    })

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

      })

    })

  }


  openAlertToReLogUser() {
    Swal.fire({

      title: 'You are not logged in?',

      text: 'Please log in to tinder.com ',

      type: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Take me there!',

      cancelButtonText: 'Cancel',

      customClass: {
        popup: 'animated tada'
      }


    }).then(result => {

      if (result.value) {

        getChrome().runtime.sendMessage({

          action: "open_tinder",

          source: 'open_tinder'

        })
      }

    })
  }


  saveLocalStorage(key, value) {
    localStorage.setItem(key, value)
  }

  goToTinder() {
    getChrome().runtime.sendMessage({

      action: "open_tinder",

      source: 'open_tinder'

    })
  }



}