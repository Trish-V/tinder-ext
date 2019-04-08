import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { environment } from '../../environments/environment'
import { SibilingsCommunicationService } from '../services/sibilings.communication.service'
import { TinderAPI } from '../services/tinder.message.retrival.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { async } from '@angular/core/testing'
import { TimeLineComponent } from './time-line/time-line.component'

declare var getChrome: any

declare var openTinder: any

declare var Swal: any

declare var Toast: any

declare var backgroundDataPublish: any


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  toggleStateAutoLiking = false


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
    HomeComponent.context = this


  

  }



  constructor(
    public sibilingsCommService: SibilingsCommunicationService,
    private tinderAPI: TinderAPI,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {


    HomeComponent.context = this

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

      this.getRecs(3050)

    } catch (error) {

    }

    // message json read from background js in assets chromejs
    backgroundDataPublish()

  }





  getRecs(sleep) {

    var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

    this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

    this.tinderAPI.services.get_all_recomendations().subscribe(res => {

      try {
        if (res.message) {
          setTimeout(() => {

            const Toast = Swal.mixin({

              toast: true,

              position: 'top-end',

              showConfirmButton: false,

              timer: 3000

            })

            Toast.fire({
              type: 'warning',

              title: 'No recomendations for now'

            })

          }, sleep)

          return
        }
      } catch (error) {

      }
      // this.profileDataSet = res.results[0]
      this.poll(res.results)

      this.sibilingsCommService.pushNotification('initialProfile', res.results[0])

    }, err => {

    })

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


  updateEveryMS = 250

  async poll(results: any) {

    for (let result of results) {
      // code to poll server and update models and view ...
      var bdate = new Date(result.birth_date)

      var nowDate = new Date()

      var age = nowDate.getTime() - bdate.getTime()

      result.age = Number(((age / (1000 * 60 * 60 * 24)) / 366).toFixed(0)) - 1

      result.schools.push({
        id: "000",
        name: "000"
      })


      result.jobs.push({
        "title": {
          "name": "000"
        }
      })

      this.listOfProfiles.push(result)

      this.sibilingsCommService.pushMessage('scrollTop')

      await this.sleep(this.updateEveryMS)
    }

  }

  sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms))

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

  refresh() {

    this.listOfProfiles = []

    this.getRecs(0)

  }

  timer
  id = 0

  autoLiking(toggleState) {
    this.toggleStateAutoLiking = toggleState 

    if (toggleState) {

      this.id = 0

      this.autoLikinScheduler()

    } 
    else

      clearTimeout(this.timer)
 
  }

  async autoLikinScheduler() {

    while (this.toggleStateAutoLiking && Object.keys(this.listOfProfiles).length > this.id) { 

      this.sibilingsCommService.pushNotification('selectOnAutoLike', this.listOfProfiles[this.id])
      this.id++

      await this.sleep(4000); 
    }

  }

}
