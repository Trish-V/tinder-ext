import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core'
import { environment } from '../../environments/environment'
import { SibilingsCommunicationService } from '../services/sibilings.communication.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { async } from '@angular/core/testing'
import { TimeLineComponent } from './time-line/time-line.component'
import { TinderAPIService } from '../services/tinder-api.service';
import { ChromeStorageService } from '../services/chrome-storage.service';

declare var getChrome: any

declare var openTinder: any

declare var Swal: any

declare var Toast: any



@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {


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
	static toggleStateAutoLiking = false;
	recCount: number;



	ngOnInit(): void {
		HomeComponent.context = this
		setTimeout(HomeComponent.autoLikeBackground, 5000, HomeComponent.i += 1, this.toggleStateAutoLiking);
		// this.autoLikeBackground()

	}



	constructor(
		public sibilingsCommService: SibilingsCommunicationService,
		private tinderAPI: TinderAPIService,
		private router: Router,
		private sanitizer: DomSanitizer,
		private chromeStorageService: ChromeStorageService
	) {


		HomeComponent.context = this

		getChrome().tabs.getSelected(null, function (tab) {

			var tablink = tab.url

			if (tablink.includes('tinder.com')) {

				getChrome().tabs.executeScript(null, { // injecting retriving dom

					file: "assets/chromejs/localstorage.js"

				}, function () {

					if (getChrome().runtime.lastError) {

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

							title: 'No new recomendations for now'

						})

					}, sleep)

					return
				}
			} catch (error) {

			}



			// console.log(res.results)

			let recs = []
			let filteredRecs = []

			this.chromeStorageService.getItem('recs', (result) => {

				if (typeof result.recs == 'undefined') {

					this.chromeStorageService.setItem({ 'recs': res.results })

					console.log('recs initialised')

					recs = res.results

					this.poll(recs)

					this.sibilingsCommService.pushNotification('initialProfile', recs[0])

				} else {

					console.log('retriving results from local storage')

					recs = result.recs

					console.log('Lneght of res.results : ' + Object.keys(res.results).length)

					console.log('Lneght of  recs : ' + Object.keys(recs).length)

					recs = recs.concat(res.results)

					console.log('Lneght of res.results + recs  : ' + Object.keys(recs).length)

					filteredRecs = recs.filter((arr, index, self) =>
						index === self.findIndex((t) => (t.save === arr.save && t._id === arr._id)))

					console.log('Lneght of filtered list : ' + Object.keys(filteredRecs).length)

					this.chromeStorageService.setItem({ 'recs': filteredRecs })
					console.log(JSON.stringify(filteredRecs))

					this.poll(filteredRecs)

					this.sibilingsCommService.pushNotification('initialProfile', filteredRecs[0])
				}

				// console.log(' ' + JSON.stringify(result.recs, null, 2))

			})


		}, err => {

		})

	}



	testLocalStorage() {// injecting localstorage script


		getChrome().tabs.executeScript(null, {

			file: "assets/chromejs/localstorage.js"

		}, function () {

			if (getChrome().runtime.lastError) {

			}

		})

	}

	updateEveryMS = 0

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
			this.recCount = Object.keys(this.listOfProfiles).length

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
		localStorage.setItem('auto_like_state', String(this.toggleStateAutoLiking))
		HomeComponent.toggleStateAutoLiking = toggleState

		if (toggleState) {

			this.id = 0

			this.autoLikinScheduler()

			

		}
		else {


			clearTimeout(this.timer)
		}
	}

	async autoLikinScheduler() {







		// console.log(Object.keys(this.listOfProfiles).length)

		/*
		for (let i = 0; i < Object.keys(this.listOfProfiles).length; i++) {
	
		  if (this.toggleStateAutoLiking) {
	
			console.log(i)
	
			console.log('testing')
			this.sibilingsCommService.pushNotification('selectOnAutoLike', this.listOfProfiles[i])
	
		  } else {
	
			break;
	
		  }
		  await this.sleep(8000);
		}
		this.toggleStateAutoLiking = !this.toggleStateAutoLiking
	
	    
		  */

		// while (this.toggleStateAutoLiking && Object.keys(this.listOfProfiles).length + 1 >= this.id) {

		//   this.sibilingsCommService.pushNotification('selectOnAutoLike', this.listOfProfiles[this.id])
		//   this.id++

		//   await this.sleep(4000);
		// }




	}


	ngOnDestroy(): void {

	}

	static i = 0

	static autoLikeBackground(index, state) {


		console.log('testing ' + index + ' ' + state)

		setTimeout(HomeComponent.autoLikeBackground, 5000, HomeComponent.i += 1, HomeComponent.toggleStateAutoLiking);

	}





}
