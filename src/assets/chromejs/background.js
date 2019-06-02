

class Util {
	static _id
	setId(id) {
		Util._id = id
	}

	getId() {
		return Util._id
	}
}

var autoLikeList = []

var state = false

var recomendationsCheckMultipiler = 3

var recomendationsTimeInterval = 900000	// in millis

var  constRecomendationsTimeInterval = 900000	// in millis

var thresholdTimeInterval = 60 * 1000 * 60 * 12 // 12 hrs

var minRecsLimit = 5

var autoLikingTimeGap = 8 * 1000

chrome.runtime.onMessage.addListener(function (request, sender) {

	if (request.action == "open_tinder") { // callback for liked recomendations 

		window.open("https://tinder.com", "_blank");


	}

	if (request.action == "getLocalStorage") {
		try {

			if (
				typeof JSON.parse(localStorage.getItem('tinder_local_storage')) != 'undefined'
				&& JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken'] != null
			) {
				if (
					!String(JSON.parse(request.source)['TinderWeb/APIToken']).match(JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken'])
				) {
					getRecsForOneTimeWhenAppOpens()
					console.log('new recs')
				}
			}
		} catch (error) {

		}
		localStorage.setItem('tinder_local_storage', request.source);


	}
	if (request.action == "is_registered_to_cupido") {
		// callback for local storage  
		localStorage.setItem('is_registered_to_cupido', request.source)
	}

	if (request.action == "platform_user_id") {
		// callback for local storage  
		localStorage.setItem('platform_user_id', String(request.source))

	}
	if (request.action == "auto_like_start") {
		// callback for local storage  
		localStorage.setItem('recs', String(request.source))

	}
	if (request.action == "auto_like_state") {
		// callback for local storage  
		localStorage.setItem('auto_like_state', String(request.source))
		var auto_like_state = localStorage.getItem('auto_like_state')

		// if (auto_like_state === 'true') {
		// 
		// }

	}


});



setTimeout(function run() {

	chrome.tabs.getSelected(null, function (tab) {

		var tablink = tab.url;

		if (tablink.includes('tinder.com')) {

			chrome.tabs.executeScript(null, { // injecting retriving dom

				file: "assets/chromejs/localstorage.js"

			}, function () {

				if (chrome.runtime.lastError) {

				}

			});

		} else {
			chrome.runtime.sendMessage({

				action: "savedLocalStorage",

				source: localStorage.getItem('tinder_local_storage')

			});
		}

	});




	setTimeout(run, 2000);
}, 2000);



// var messages= new TinderMessages();


setTimeout(function run() {
	try {

		if (
			localStorage.getItem('is_registered_to_cupido').toString().match('true')
			//  && typeof localStorage.getItem('tinder_local_storage')['TinderWeb/APIToken'] !== 'undefined'
		) {

			// var main = new Main(JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken']);

		} else {
		}

	} catch (error) {

	}

	setTimeout(run, 15000);
}, 10000);



function getRecs(subscribe) {
	getItem('recs', result => {
		subscribe(result.recs)
	})
}

function setItem(keyValue) {
	chrome.storage.local.set(keyValue, function () {
	});
}

function getItem(key, subscribe) {
	chrome.storage.local.get(key, function (result) {
		subscribe(result)
	});

}

function notifyApplication(title, message) {
	chrome.runtime.sendMessage({

		action: title,

		source: 'JSON.stringify(message)'

	});

}


function getRecsForOneTimeWhenAppOpens() {

	try {
		if (

			localStorage.getItem('tinder_local_storage') !== null
		) {
			var tinderToken = JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken']

			let recs = []

			let filteredRecs = []

			var tinderService = new TinderService();


			console.log('timer  ...')

			tinderService.getRecs({ token: tinderToken }, res => {

				if (res.status == 401) {
					notifyApplication('re_log_user', '')
					return
				}
				if (res.status == 429) {
					recomendationsTimeInterval = recomendationsTimeInterval * recomendationsCheckMultipiler
					if (recomendationsTimeInterval >= thresholdTimeInterval) {

						recomendationsTimeInterval = constRecomendationsTimeInterval
					}
					return
				}
				try {
					if (res.results == null) {
						return
					}
				} catch (error) {

				}
				if (Object.keys(res.results).length == 0) {

					recomendationsTimeInterval = recomendationsTimeInterval * recomendationsCheckMultipiler
					if (recomendationsTimeInterval >= thresholdTimeInterval) {

						recomendationsTimeInterval = constRecomendationsTimeInterval
					}
					return
				}

				recomendationsTimeInterval = constRecomendationsTimeInterval * 10
				// console.log(JSON.stringify(res))

				getItem('recs', result => {

					if (typeof result.recs === 'undefined') {

						setItem({ recs: res.results })

						console.log('initial recs')

						notifyApplication("background_retrived_data", JSON.stringify(res.results))


					} else {

						recs = result.recs

						recs = recs.concat(res.results)

						filteredRecs = recs.filter((arr, index, self) =>
							index === self.findIndex((t) => (t.save === arr.save && t._id === arr._id)))


						setItem({ 'recs': filteredRecs })


						notifyApplication("background_retrived_data", JSON.stringify(filteredRecs))

						// console.log(JSON.stringify(filteredRecs)  )

						console.log(Object.keys(filteredRecs).length)


					}
				})
			})

		}

	} catch (error) {

	}



}


setTimeout(function run() {
	getRecsForOneTimeWhenAppOpens()

	setTimeout(run, recomendationsTimeInterval)


}, 2000);

setTimeout(function run() {


	try {
		if (

			localStorage.getItem('tinder_local_storage') !== null
		) {

			if (auto_like_state === 'true') {
				getItem('recs', result => {

					if (typeof result.recs[0] != 'undefined' && result.recs[0]._id != null) {

						var tinderToken = JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken']

						var auto_like_state = localStorage.getItem('auto_like_state')

						var tinderService = new TinderService();
						var util = new Util()
						util.setId(result.recs[0]._id)


						console.log("auto like continues")
						tinderService.like({ match_id: util.getId(), token: tinderToken }, res => {
							if (res.status == 401) {

							} else {

								var rec = result.recs.find(u => u._id == util.getId())

								console.log(rec.name)
								// result.recs.shift()

								// result.recs.splice(rec, 1)
								if (result.recs[0] == rec) {

									result.recs.splice(rec, 1)
								}
								getItem('history', res => {

									rec.state = 'liked'
									rec.action_performed_on = Date.now()
									res.push(rec)
									setItem({ 'history': res })
								})


								setItem({ 'recs': result.recs })

								notifyApplication("background_retrived_data", '')


							}
						})




					}


				})


			}


		}

	} catch (error) {

	}


	setTimeout(run, 10000);
}, 4000);





