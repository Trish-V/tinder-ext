import { Component, OnInit, Input } from '@angular/core'
import { environment } from '../environments/environment'
import { SibilingsCommunicationService } from './services/sibilings.communication.service'
import { Router } from '@angular/router'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { async } from '@angular/core/testing'
import { TinderAPIService } from './services/tinder-api.service';
import { CupidoAPIService } from './services/cupido-api.service';

declare var getChrome: any

declare var openTinder: any

declare var Swal: any

declare var Toast: any

declare var testFunctionBackground: any

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

		AppComponent.context = this
		this.testFunctionBackground()
	}



	constructor(
		public sibilingsCommService: SibilingsCommunicationService,
		private tinderAPI: TinderAPIService,
		private cupidoAPI: CupidoAPIService,
		private router: Router,
		private sanitizer: DomSanitizer
	) {
		var firstOpenning = JSON.stringify(localStorage.getItem('opened_state')).toString().length > 0



		AppComponent.context = this

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
				// console.log('savedLocalSTorage ' + request.source)
			}
			if (request.action == "getLocalStorage") {

				// console.log('getLocalStorage ' + request.source)
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

			this.profileDisplayPicture = res.data.user.photos[0].url

			this.username = res.data.user.name

			localStorage.setItem('user_profile', JSON.stringify(res))

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

			// toggling false will stop saving profile and throw subscribe undefined
			this.cupidoAPI.services.initCupidoAPI(true)

			/*	this.cupidoAPI.services.createProfile(JSON.parse(localStorage.getItem('user_profile'))).subscribe(res => {
	
	
					localStorage.setItem('is_registered_to_cupido', 'true')
	
					localStorage.setItem('platform_user_id', String(JSON.parse(localStorage.getItem('user_profile')).data.user._id))
	
					if (res.id != null)
	
						getChrome().runtime.sendMessage({
	
							action: "is_registered_to_cupido",
	
							source: 'true'
	
						})
	
	
					getChrome().runtime.sendMessage({
	
						action: "platform_user_id",
	
						source: String(localStorage.getItem('platform_user_id'))
	
					})
	
	
				},
					error => {
	
						console.log("ERR : " + JSON.stringify(error) + ' ' + error)
	
					}, () => {
	
					})*/

		}, err => {
			if (err.status) {

				console.log('No Access ' + err.status)
				this.openAlertToReLogUser()

			}

		})



	}
	checkIfIntialOpenOfApp(): boolean {
		try {

			if (localStorage.getItem('tinder_local_storage') === null) {


			} else {

				return true

			}
		} catch (e) {


		}

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


	//  checks the state of initial open or not( normal frequant user)
	openAlertToReLogUser() {
		if (!this.checkIfIntialOpenOfApp()) {

			Swal.fire({
				title: '<strong>User Agreement </strong>',

				type: 'warning',

				html:
					'To view User Agreement, Terms and Conditions , Privacy policy and other information, ' +
					'<a href="//github.com">Click</a> here' +
					' <b>By clicking <u>Start Swiping</u> you are agreeing with above agreement and privacy policy',

				showCloseButton: true,

				showCancelButton: false,

				focusConfirm: false,

				confirmButtonText:
					'Start Swiping',

				confirmButtonAriaLabel: 'Start Swiping',

				allowOutsideClick: false,

			}).then(result => {

				if (result.value) {

					this.openAlertToLogUserSweetAlert()

				}

			})
			return
		}

		this.openAlertToLogUserSweetAlert()

	}

	openAlertToLogUserSweetAlert() {

		Swal.fire({

			title: 'You are not logged in?',

			text: 'Please log in to tinder.com ',

			type: 'warning',

			showCancelButton: true,

			confirmButtonText: 'Take me there!',

			cancelButtonText: 'Cancel',

			allowOutsideClick: false,

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


	testFunctionBackground() {

		// setTimeout(function run() {

		//   alert('testing')
		//   setTimeout(run, 6000);
		// }, 6000);


	}


}