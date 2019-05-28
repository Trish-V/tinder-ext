
class TinderService {

	xhr = new XMLHttpRequest();


	constructor() {
		this.xhr = new XMLHttpRequest();
		this.xhr.withCredentials = true;
	}



	getMatchesOfTheUserFirstPage(options = { count: 60, locale: 'en', message: 1, token: '' }, subscribe = { res: '' }) {

		this.xhr.open("GET", "https://api.gotinder.com/v2/matches?" +
			"count=" + (options.count) +
			"&locale=" + (options.locale) +
			"&message=" + (options.message));

		this.xhr.setRequestHeader("platform", "web");

		this.xhr.setRequestHeader("x-auth-token", (options.token));

		this.xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		});

		this.xhr.send();

	}

	getMatchesOfTheUserSecondPage(options = { count: 60, locale: 'en', message: 1, page_token: '', token: '' }, subscribe = { res: '' }) {

		this.xhr.open("GET", "https://api.gotinder.com/v2/matches?" +
			"count=" + options.count +
			"&locale=" + options.locale +
			"&message=" + options.message +
			"&page_token=" + options.page_token);

		this.xhr.setRequestHeader("x-auth-token", options.token);

		this.xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		});

		this.xhr.send();

	}

	getMessagesOfTheFirstPage(options = { count: 60, locale: 'en', match_id: '', token: '' }, subscribe = { res: '' }) {


		this.xhr.open("GET", "https://api.gotinder.com/v2/matches/" + options.match_id +
			"/messages?count=" + options.count +
			"&locale=" + options.locale);

		this.xhr.setRequestHeader("x-auth-token", options.token);

		this.xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		})

		this.xhr.send();

	}
	getMessagesOfTheUserSecondPage(options = { count: 60, locale: 'en', match_id: '', page_token: '', token: '' }, subscribe = { res: '' }) {


		this.xhr.open("GET", "https://api.gotinder.com/v2/matches/" + options.match_id +
			"/messages?count=" + options.count +
			"&locale=" + options.locale +
			"&page_token=" + options.page_token);

		this.xhr.setRequestHeader("x-auth-token", options.token);

		this.xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		})

		this.xhr.send();

	}

	like(options = { match_id: '', token: '' }, subscribe = { res: '' }) {
		this.xhr.open("GET", "https://api.gotinder.com/like/" + options.match_id);

		this.xhr.setRequestHeader("x-auth-token", options.token);

		this.xhr.addEventListener("readystatechange", function () {

			if (this.readyState === 4) {

				subscribe(this.responseText);

			}
		})

		this.xhr.send();
	}


	getRecs(options = { token: '' }, subscribe = { res: '' }) {
		try {
			this.xhr.open("GET", "https://api.gotinder.com/user/recs");

			this.xhr.setRequestHeader("x-auth-token", options.token);

			this.xhr.addEventListener("readystatechange", function () {

				if (this.readyState === 4) {
					if (this.status === 401) {  //check if "OK" (200)
						return
					}

					subscribe(JSON.parse(this.responseText));

				}
			})

			this.xhr.send();
		} catch (error) {

		}

	}



}