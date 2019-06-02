import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core'
import { environment } from '../../environments/environment'
import { SibilingsCommunicationService } from '../services/sibilings.communication.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { async } from '@angular/core/testing'
import { TimeLineComponent } from './time-line/time-line.component'
import { TinderAPIService } from '../services/tinder-api.service';
import { ChromeStorageService } from '../services/chrome-storage.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

declare var getChrome: any

declare var openTinder: any

declare var Swal: any

declare var Toast: any

declare var getRecs: any


declare var getRecsForOneTimeWhenAppOpens: any

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
	static notificationService: SibilingsCommunicationService;
	chrome: any;



	ngOnInit(): void {

		getRecsForOneTimeWhenAppOpens()

		HomeComponent.context = this

		HomeComponent.notificationService = this.sibilingsCommService

		if (typeof localStorage.getItem('auto_like_state') == 'undefined') {
			localStorage.setItem('auto_like_state', 'false')
		}
		else if (localStorage.getItem('auto_like_state') !== null)
			if (localStorage.getItem('auto_like_state').match('true')) {
				this.toggleStateAutoLiking = true
				this.refresh()
			} else {
				this.toggleStateAutoLiking = false
			}

		// setTimeout(HomeComponent.autoLikeBackground, 5000, HomeComponent.i += 1, this.toggleStateAutoLiking);



		let thisContext = this
		this.chrome.runtime.onMessage.addListener(function (request, sender) {
			if (request.action == "savedLocalStorage") {

				thisContext.saveLocalStorage('tinder_local_storage', request.source)

			}
			if (request.action == "getLocalStorage") {

				localStorage.setItem('tinder_local_storage', request.source)

			}
			if (request.action == "background_retrived_data") {
				thisContext.sibilingsCommService.pushNotification('background_recs_set', '')
				thisContext.refresh()

			}

		})




		this.sibilingsCommService.notificationAnnounced$.subscribe(msg => {
			if (msg.topic == 'refreshCount') {
				// 
			}
			if (msg.topic == 'pass') {

				var rec = this.listOfProfiles.find(u => u._id == msg.message)

				this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1)

				this.chromeStorageService.getItem('history', res => {
					if (typeof rec != 'undefined') {
						rec.state = 'pass'
						rec.action_performed_on = Date.now()
						res.push(rec)
						this.chromeStorageService.setItem(res)
					}
				})


				this.chromeStorageService.setItem({ 'recs': this.listOfProfiles })

				this.recCount = Object.keys(this.listOfProfiles).length

				// this.sibilingsCommService.pushNotification('selectOnClick', this.listOfProfiles[0])

			} else if (msg.topic == 'like') {

				var rec = this.listOfProfiles.find(u => u._id == msg.message)

				console.log(JSON.stringify(rec, null, 4))

				this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1)


				this.chromeStorageService.getItem('history', res => {
					if (typeof rec != 'undefined') {
						rec.state = 'like'
						rec.action_performed_on = Date.now()
						res.push(rec)
						this.chromeStorageService.setItem(res)
					}

				})


				this.chromeStorageService.setItem({ 'recs': this.listOfProfiles })

				this.recCount = Object.keys(this.listOfProfiles).length + 1


				// this.sibilingsCommService.pushNotification('selectOnClick', this.listOfProfiles[0])

			} else if (msg.topic == 'superlike') {

				var rec = this.listOfProfiles.find(u => u._id == msg.message)

				this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1)


				this.chromeStorageService.getItem('history', res => {
					if (typeof rec != 'undefined') {
						rec.state = 'superlike'
						rec.action_performed_on = Date.now()
						res.push(rec)
						this.chromeStorageService.setItem(res)
					}
				})


				this.chromeStorageService.setItem({ 'recs': this.listOfProfiles })

				this.recCount = Object.keys(this.listOfProfiles).length + 1


				// this.sibilingsCommService.pushNotification('selectOnClick', this.listOfProfiles[0])

			}

			else if (msg.topic == 'background_recs_set') {
				this.refresh()
				// HomeComponent.context.chromeStorageService.getItem('recs', res => {


				// })

			}
		})

		getRecsForOneTimeWhenAppOpens()

		this.refresh()
	}



	constructor(
		public sibilingsCommService: SibilingsCommunicationService,
		private tinderAPI: TinderAPIService,
		private router: Router,
		private sanitizer: DomSanitizer,
		private chromeStorageService: ChromeStorageService
	) {

		this.chrome = getChrome()

		HomeComponent.context = this
		HomeComponent.notificationService = sibilingsCommService

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





	}


	checkForNewRecs() {

		setTimeout(function run() {


			setTimeout(run, 8000);
		}, 0);


	}


	getRecs(sleep) {

		var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

		this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

		this.chromeStorageService.getItem('recs', (result) => {

			this.poll(result.recs)
			this.sibilingsCommService.pushNotification('selectOnClick', result.recs[0])
		})
		this.chromeStorageService.getItem('recs', (result) => {

			this.poll(result.recs)
			this.sibilingsCommService.pushNotification('selectOnClick', result.recs[0])
		})
		this.chromeStorageService.getItem('recs', (result) => {

			this.poll(result.recs)
			this.sibilingsCommService.pushNotification('selectOnClick', result.recs[0])
		})

		/*	this.tinderAPI.services.get_all_recomendations().subscribe(res => {
	
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
						this.recCount = Object.keys(recs).length
	
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
						this.recCount = Object.keys(filteredRecs).length
					}
	
					// console.log(' ' + JSON.stringify(result.recs, null, 2))
	
				})
	
	
			}, err => {
	
			})
	
			*/

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

	poll(results: any) {
		this.listOfProfiles = []
		if (typeof results == 'undefined') {
			return
		}

		if (results == null) {
			return
		}

		if (Object.keys(results).length == 0) {
			return
		}

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

			// await this.sleep(this.updateEveryMS)
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

		// this.getRecs(0)

		this.chromeStorageService.getItem('recs', res => {

			let filteredRecs = []

			// filteredRecs = recs.filter((arr, index, self) =>
			// index === self.findIndex((t) => (t.save === arr.save && t._id === arr._id)))


			filteredRecs = res.recs

			this.poll(filteredRecs)

			if (typeof res.recs != 'undefined')
				this.sibilingsCommService.pushNotification('selectOnClick', res.recs[0])
			console.log(JSON.stringify(res.recs, null, 4))

		})


	}

	timer
	id = 0

	autoLiking(toggleState) {

		this.toggleStateAutoLiking = toggleState
		localStorage.setItem('auto_like_state', String(this.toggleStateAutoLiking))
		HomeComponent.toggleStateAutoLiking = toggleState

		if (toggleState) {


			getChrome().runtime.sendMessage({

				action: "auto_like_state",

				source: String(toggleState)

			})


		}
		else {


			clearTimeout(this.timer)
		}
	}


	ngOnDestroy(): void {

	}

	static i = 0

	static autoLikeBackground(index, state) {

		console.log('running in background ')

		if (localStorage.getItem('auto_like_state') !== null) {

			var autoLiking = localStorage.getItem('auto_like_state')

			if (autoLiking.match('true')) {
				console.log('like in background ')
				console.log('testing ' + index + ' ' + autoLiking)

				var notificationService = new SibilingsCommunicationService()
				var chromeService = new ChromeStorageService()
				var lsitOfProfiles = []
				chromeService.getItem('recs', (result) => {

					lsitOfProfiles = result.recs

					if (Object.keys(lsitOfProfiles).length > 0) {

						// HomeComponent.notificationService.pushNotification('backgroundLike', lsitOfProfiles[0])





					}



				})


			}
		}


		setTimeout(HomeComponent.autoLikeBackground, 5000, HomeComponent.i += 1, autoLiking);

	}





	static like(options = { match_id: '', token: '' }, subscribe) {

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.open("GET", "https://api.gotinder.com/like/" + options.match_id);

		xhr.setRequestHeader("x-auth-token", options.token);

		xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		})

		xhr.send();
	}


	static getRecs(options = { token: '' }, subscribe) {
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open("GET", "https://api.gotinder.com/user/recs");

		xhr.setRequestHeader("x-auth-token", options.token);

		xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {



				subscribe(this.responseText);

			}
		})

		xhr.send();
	}


}
