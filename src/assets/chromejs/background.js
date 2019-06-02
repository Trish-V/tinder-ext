

// setItem({ 'history': [] })
localStorage.setItem('logged_in', 'true')
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

var constRecomendationsTimeInterval = 900000	// in millis

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
					console.log('401 error')
					return
				}
				localStorage.setItem('logged_in', 'true')
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

						filteredRecs = recs.filter((arr, index, self) =>
							index === self.findIndex((t) => (t.save === arr.save && t._id === arr._id)))


						setItem({ 'recs': filteredRecs })

						// setTimeout(function run() {

						// 	notifyApplication("background_retrived_data", JSON.stringify(filteredRecs))


						// }, 2000)
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
			var auto_like_state = localStorage.getItem('auto_like_state')
			if (auto_like_state === 'true') {



				var util = new Util()

				getItem('recs', result => {

					if (typeof result.recs[0] != 'undefined' && result.recs[0]._id != null) {

						util.setId(result.recs[0]._id)
						console.log('deleting 0th' + result.recs[0].name + ' id ' + ' ' + util.getId() + ' ' + result.recs[0]._id)
						console.log('deleting 1st' + result.recs[1].name + ' id ' + ' ' + result.recs[1]._id  )

						var tinderToken = JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken']
						var i = 0



						var rec = result.recs.find(u => u._id == util.getId())
						var index = result.recs.indexOf(rec);

						var tinderService = new TinderService();
						console.log("auto like continues")
						tinderService.like({ match_id: util.getId(), token: tinderToken }, res => {

							if (i == 0) {
								if (res.status == 401) {
									console.log('401 error')
								} else {

									console.log('deleting 0th' + result.recs[0].name + ' id : ' + '  ' + util.getId() + ' : ' + result.recs[0]._id)
									console.log(rec.name)

									// result.recs.shift()
									var newRecs = []
									// result.recs.splice(rec, 1)
									if (result.recs[0] == rec) {


										newRecs = result.recs

										// for (var i = 1; i < Object.keys(result.recs).length; i++) {
										// 	newRecs.push(result.recs[i])
										// }

										// result.recs.shift()
										if (rec._id === util.getId() && rec._id === result.recs[0]._id) {

											console.log('before : '+Object.keys(newRecs).length)
											newRecs.splice(index, 1) 
											console.log('after : '+Object.keys(newRecs).length)

											getItem('history', res => {

												var profiles = []

												if (typeof res.history != 'undefined')
													profiles = res.history

												var profile = {}

												profile = rec

												profile.state = 'like'

												profile.action_performed_on = Date.now()

												// console.log(JSON.stringify(profile, null, 2))

												if (typeof profiles != 'undefined')
													profiles.push(profile)

												setItem({ 'history': profiles })


												setItem({ 'recs': newRecs })

												notifyApplication("background_retrived_data", '')
											})


										}

										// console.log(  JSON.stringify( result.rec[index],null,2 )  )
										// delete newRecs[index]


									}



								}
							}
							i++

						})




					}


				})


			}


		}

	} catch (error) {

	}


	setTimeout(run, 12000);
}, 4000);




setTimeout(function run() {
	if (localStorage.getItem('logged_in').match('false')) {

		notifyApplication('re_log_user', '')
	}
	setTimeout(run, 5000)
}, 5000
)