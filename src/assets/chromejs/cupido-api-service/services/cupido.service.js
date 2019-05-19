
class CupidoService {

    xhr = new XMLHttpRequest();
    // match_list = []
    host = ''


    constructor(host) {
        this.host = host
        this.xhr = new XMLHttpRequest();
        this.xhr.withCredentials = true;
    }


    saveMatch(match, subscribe = { res: '' }) {

        this.xhr = new XMLHttpRequest();
        // this.xhr.withCredentials = true;

        var data = JSON.stringify(match);
        this.xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                 
                subscribe(this.responseText)
            }
        });

        this.xhr.open('POST', this.host + '/ext/matches');
        this.xhr.setRequestHeader('Content-Type', 'application/json');

        this.xhr.send(data);
    }

    messageIdListForTheMatch(match_id, subscribe = { res: '' }) {
        var data = JSON.stringify(false);

        var url_match_id = String(match_id)

        this.xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                 
                subscribe(this.responseText)
            }
        }); 

        var url = this.host + '/ext/matches/' + url_match_id + '/messages'
        this.xhr.open('GET', url);
        this.xhr.setRequestHeader('Content-Type', 'application/json');

        this.xhr.send(data);
    }


    saveMessage(match_id, msg, subscribe = { res: '' }) {
        var data = []
        data.push(msg); 
        this.xhr = new XMLHttpRequest();
        this.xhr.withCredentials = true;

        this.xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) { 
                subscribe(this.responseText)
            }
        });
        var url = this.host + '/ext/matches/' + String(match_id) + '/messages'
 

        this.xhr.open('POST', url);
        this.xhr.setRequestHeader('Content-Type', 'application/json');
  

        this.xhr.send(JSON.stringify(data));

    }




}