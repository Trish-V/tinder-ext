import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

import { NguCarouselConfig, NguCarousel } from '@ngu/carousel'
import { slider } from './animation'
import { SibilingsCommunicationService } from 'src/app/services/sibilings.communication.service';
import { TinderAPIService } from 'src/app/services/tinder-api.service';


declare var Swal: any

@Component({
	selector: 'app-profile-card',
	templateUrl: './profile-card.component.html',
	styleUrls: ['./profile-card.component.scss'],
	animations: [slider],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnInit {

	@ViewChild('myCarousel') myCarousel: any

	stateLike = false

	stateDislike = false

	@Input() profileDataSet =
		{
			_id: '',
			name: '',
			age: '',
			schools: [
				{
					// id: '',
					name: ''
				}
			],
			distance_mi: 0,
			jobs: [
				{
					title: {
						name: ''
					}
				}

			]
		}

	backUpProfileDataSet =
		{
			_id: '',
			name: '',
			age: '',
			schools: [
				{
					// id: '',
					name: ''
				}
			],
			distance_mi: 0,
			jobs: [
				{
					title: {
						name: ''
					}
				}

			]
		}

	school = this.profileDataSet.schools[0].name

	job = this.profileDataSet.jobs[0].title.name

	placeHolderImages = [
		'../../../assets/images/placeholder.jpg',
		'../../../assets/images/placeholder.jpg'
	]

	@Input() name: string

	public carouselTileItems$: Array<any> = this.placeHolderImages

	public carouselTileConfig: NguCarouselConfig = {
		grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
		speed: 250,
		point: {
			visible: true
		},
		touch: true,
		loop: true,
		interval: { timing: 2000 },
		animation: 'lazy'
	}

	tempData: any[]

	dropState = false

	private recId = ''

	constructor(
		private sanitizer: DomSanitizer,
		private tinderAPI: TinderAPIService,
		private sibilingsCommService: SibilingsCommunicationService
	) {


	}

	ngOnInit() {
		this.school = '000'
		this.job = '000'
		this.profileDataSet.distance_mi = 0


		this.sibilingsCommService.notificationAnnounced$.subscribe(msg => {
			if (msg.topic == 'pass' || msg.topic == 'like') {

				// this.carouselTileItems$ = this.placeHolderImages

				// this.profileDataSet = this.backUpProfileDataSet


				this.myCarousel.reset(false)

			}
			if (msg.topic == 'selectOnClick') {
				this.carouselProfileSetup('selectOnClick', null, msg.message)
			}
			if (msg.topic == 'initialProfile') {
				this.carouselProfileSetup('initialProfile', null, msg.message)

			}
			if (msg.topic == 'selectOnAutoLike') {
				console.log('auto liked')

			}
			if (msg.topic == 'backgroundLike') {

				this.carouselProfileSetup('selectOnAutoLike', null, msg.message)
				this.serviceLikeImpl(msg.message._id);
			}

		})
	}

	allowDrop(ev) {
		ev.preventDefault()

	}

	drop(ev) {

		this.carouselProfileSetup('drag', ev, null)

	}

	dragenter(ev) {

		this.dropState = (String(ev.target.className).trim().includes('tile')) ? true : this.dropState;

		ev.preventDefault();

	}

	dragleave(ev) {
		this.dropState = (String(ev.target.className).trim().includes('tile')) ? false : this.dropState;

		ev.preventDefault();

	}

	like() {
		this.stateLike = true

		this.stateDislike = true

		this.serviceLikeImpl(this.profileDataSet._id);


		this.school = '000'
		this.job = '000'
		this.profileDataSet.distance_mi = 0


		// this.sibilingsCommService.pushNotification('refreshCount', [])

	}
	pass() {
		this.stateDislike = true

		this.stateLike = true

		this.servicePassImpl(this.profileDataSet._id);


		this.school = '000'
		this.job = '000'
		this.profileDataSet.distance_mi = 0

 

	}
	superLike() {


		this.serviceSuperLikeImpl(this.profileDataSet._id);

 
	}

	serviceLikeImpl(recID) {

		var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

		this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

		this.tinderAPI.services.like(recID).subscribe(res => {

			this.sibilingsCommService.pushNotification('like', recID)

			const Toast = Swal.mixin({
				toast: true,

				position: 'top-end',

				showConfirmButton: false,

				timer: 3000

			})

			Toast.fire({
				type: 'success',

				title: 'Liked'

			})
		})
	}
	serviceSuperLikeImpl(recID) {

		var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

		this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

		this.tinderAPI.services.meta().subscribe(meta => {
			var superLikesRemaining = meta.rating.super_likes.remaining

			if (superLikesRemaining == 0) {

				this.stateDislike = false

				this.stateLike = false

				const Toast = Swal.mixin({
					toast: true,

					position: 'top-end',

					showConfirmButton: false,

					timer: 3000

				})

				Toast.fire({
					type: 'info',

					title: 'No More Super Likes Available'

				})
			} else {

				this.tinderAPI.services.super_like(recID).subscribe(res => {

					this.sibilingsCommService.pushNotification('like', recID)
					this.stateDislike = true

					this.stateLike = true



					this.school = '000'
					this.job = '000'
					this.profileDataSet.distance_mi = 0


					const Toast = Swal.mixin({
						toast: true,

						position: 'top-end',

						showConfirmButton: false,

						timer: 3000

					})

					Toast.fire({
						type: 'success',

						title: 'Super Liked - ' + superLikesRemaining + ' Left'

					})

				})
			}

		})


	}
	servicePassImpl(recID) {

		var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'))

		this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken'])

		this.tinderAPI.services.pass(recID).subscribe(res => {

			this.sibilingsCommService.pushNotification('pass', recID)

			const Toast = Swal.mixin({
				toast: true,

				position: 'top-end',

				showConfirmButton: false,

				timer: 3000

			})

			Toast.fire({
				type: 'error',

				title: 'Disliked'

			})
		})
	}

	carouselProfileSetup(type: String, ev, dataPayLoadOfProfile) {

		this.stateLike = false

		this.stateDislike = false

		this.dropState = false

		var data;

		if (type == 'drag') {

			data = ev.dataTransfer.getData("text")

			ev.preventDefault()

		} else if (type == 'selectOnClick' || type == 'initialProfile' || type == 'selectOnAutoLike') {

			data = JSON.stringify(dataPayLoadOfProfile)



		}

		try {



			this.profileDataSet = JSON.parse(data)

			this.school = this.profileDataSet.schools[0].name

			this.job = this.profileDataSet.jobs[0].title.name

			this.carouselTileItems$ = []

			for (var photos of JSON.parse(data).photos) {

				this.myCarousel.moveTo(0, true)
				this.carouselTileItems$.push(photos.processedFiles[0].url)
				this.myCarousel.moveTo(0, true)
			}

			this.myCarousel.reset(true)

			if (type == 'selectOnAutoLike') {
				// this.profileDataSet =  dataPayLoadOfProfile

				setTimeout(() => {

					this.like()

				}, 4000);


			}



		} catch (error) {

		}


	}

}
