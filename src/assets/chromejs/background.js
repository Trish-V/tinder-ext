

var autoLikeList = []
var state = false

var recomendationsCheckMultipiler = 3
var recomendationsTimeInterval = 10000	// in millis

var constRecomendationsTimeInterval = 10000	// in millis

var thresholdTimeInterval = 60 * 1000 * 60 * 12 // 12 hrs

chrome.runtime.onMessage.addListener(function (request, sender) {

	if (request.action == "open_tinder") { // callback for liked recomendations 

		window.open("https://tinder.com", "_blank");


	}

	if (request.action == "getLocalStorage") {

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

				if (res.status == 401) return

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