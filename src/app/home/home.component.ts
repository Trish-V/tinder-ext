import {Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
import {environment} from '../../environments/environment';
import {SibilingsCommunicationService} from '../services/sibilings.communication.service';
import {Router} from '@angular/router';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {async} from '@angular/core/testing';
import {TimeLineComponent} from './time-line/time-line.component';
import {TinderAPIService} from '../services/tinder-api.service';
import {ChromeStorageService} from '../services/chrome-storage.service';
import {listLazyRoutes} from '@angular/compiler/src/aot/lazy_routes';

declare var getChrome: any;

declare var openTinder: any;

declare var Swal: any;

declare var Toast: any;

declare var getRecs: any;

declare var getRecsForOneTimeWhenAppOpens: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    constructor(
        public sibilingsCommService: SibilingsCommunicationService,
        private tinderAPI: TinderAPIService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private chromeStorageService: ChromeStorageService
    ) {

        this.chrome = getChrome();

        HomeComponent.context = this;

        HomeComponent.notificationService = sibilingsCommService;

        getChrome().tabs.getSelected(null, function(tab) {

            var tablink = tab.url;

            if (tablink.includes('tinder.com')) {

                getChrome().tabs.executeScript(null, { // injecting retriving dom

                    file: 'assets/chromejs/localstorage.js'

                }, function() {

                    if (getChrome().runtime.lastError) {

                    }

                });

            }

        });

    }

    static context;

    static toggleStateAutoLiking = false;

    static notificationService: SibilingsCommunicationService;

    toggleStateAutoLiking = false;

    @Input()
    profileDataSet = {

        name: '',

        age: '',

        distance: '',

        imgUrl: '',

        studies: ''

    };

    listOfProfiles = [];

    recCount: number;

    chrome: any;

    updateEveryMS = 0;

    timer;
    id = 0;

    ngOnInit(): void {

        HomeComponent.context = this;

        HomeComponent.notificationService = this.sibilingsCommService;

        if (typeof localStorage.getItem('auto_like_state') == 'undefined') {
            localStorage.setItem('auto_like_state', 'false');
        } else if (localStorage.getItem('auto_like_state') !== null) {
            if (localStorage.getItem('auto_like_state').match('true')) {
                this.toggleStateAutoLiking = true;
                this.refresh();
            } else {
                this.toggleStateAutoLiking = false;
            }
        }

        let thisContext = this;
        this.chrome.runtime.onMessage.addListener(function(request, sender) {
            if (request.action == 'savedLocalStorage') {

                thisContext.saveLocalStorage('tinder_local_storage', request.source);

            }
            if (request.action == 'getLocalStorage') {

                localStorage.setItem('tinder_local_storage', request.source);

            }
            if (request.action == 'background_retrived_data') {
                thisContext.sibilingsCommService.pushNotification('background_recs_set', '');
                thisContext.refresh();
                setTimeout(function run() {
                    thisContext.refresh();
                }, 500);

            }

        });

        this.sibilingsCommService.notificationAnnounced$.subscribe(msg => {

            if (msg.topic == 'pass') {

                var rec = this.listOfProfiles.find(u => u._id == msg.message);

                this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1);

                this.chromeStorageService.getItem('history', res => {
                    if (typeof rec != 'undefined') {
                        rec.state = 'pass';
                        rec.action_performed_on = Date.now();
                        res.history.push(rec);
                        this.chromeStorageService.setItem({history: res.history});
                    }
                });

                this.chromeStorageService.setItem({recs: this.listOfProfiles});

                this.recCount = Object.keys(this.listOfProfiles).length;

            } else if (msg.topic == 'like') {

                var rec = this.listOfProfiles.find(u => u._id == msg.message);

                console.log(JSON.stringify(rec, null, 4));

                this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1);

                this.chromeStorageService.getItem('history', res => {
                    if (typeof rec != 'undefined') {
                        rec.state = 'like';
                        rec.action_performed_on = Date.now();
                        res.history.push(rec);
                        this.chromeStorageService.setItem({history: res.history});
                    }

                });

                this.chromeStorageService.setItem({recs: this.listOfProfiles});

                this.recCount = Object.keys(this.listOfProfiles).length + 1;

                // this.sibilingsCommService.pushNotification('selectOnClick', this.listOfProfiles[0])

            } else if (msg.topic == 'superlike') {

                var rec = this.listOfProfiles.find(u => u._id == msg.message);

                this.listOfProfiles.splice(this.listOfProfiles.indexOf(rec), 1);

                this.chromeStorageService.getItem('history', res => {
                    if (typeof rec != 'undefined') {
                        rec.state = 'superlike';
                        rec.action_performed_on = Date.now();
                        res.history.push(rec);
                        this.chromeStorageService.setItem({history: res.history});
                    }
                });

                this.chromeStorageService.setItem({recs: this.listOfProfiles});

                this.recCount = Object.keys(this.listOfProfiles).length;

                // this.sibilingsCommService.pushNotification('selectOnClick', this.listOfProfiles[0])

            }

        });

        // this.refresh()

        setTimeout(function run() {

            thisContext.refresh();
            console.log(' 2sec interval for calling list retrival');

        }, 1000);
    }

    getRecs(sleep) {

        var localStorageData = JSON.parse(localStorage.getItem('tinder_local_storage'));

        this.tinderAPI.services.initTinderToken(localStorageData['TinderWeb/APIToken']);

        this.chromeStorageService.getItem('recs', (result) => {

            this.poll(result.recs);

            this.sibilingsCommService.pushNotification('selectOnClick', result.recs[0]);

        });

    }

    testLocalStorage() {// injecting localstorage script

        getChrome().tabs.executeScript(null, {

            file: 'assets/chromejs/localstorage.js'

        }, function() {

            if (getChrome().runtime.lastError) {

            }

        });

    }

    poll(results: any) {
        // this.listOfProfiles = []
        if (typeof results == 'undefined') {
            return;
        }

        if (results == null) {
            return;
        }

        if (Object.keys(results).length == 0) {
            return;
        }

        for (let result of results) {
            // code to poll server and update models and view ...
            var bdate = new Date(result.birth_date);

            var nowDate = new Date();

            var age = nowDate.getTime() - bdate.getTime();

            result.age = Number(((age / (1000 * 60 * 60 * 24)) / 366).toFixed(0)) - 1;

            result.schools.push({
                id: '000',
                name: '000'
            });

            result.jobs.push({
                title: {
                    name: '000'
                }
            });

            this.listOfProfiles.push(result);

            this.recCount = Object.keys(this.listOfProfiles).length;

            this.sibilingsCommService.pushMessage('scrollTop');

            // await this.sleep(this.updateEveryMS)
        }
        this.recCount = Object.keys(results).length;

    }

    sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

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

                    action: 'open_tinder',

                    source: 'open_tinder'

                });
            }

        });
    }

    saveLocalStorage(key, value) {

        localStorage.setItem(key, value);

    }

    refresh() {

        this.listOfProfiles = [];

        this.chromeStorageService.getItem('recs', res => {

            let filteredRecs = [];

            //  filter for duplicates
            filteredRecs = res.recs.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.save === arr.save && t._id === arr._id)));

            try {
                if (res == null) {
                    return;
                }

                this.poll(filteredRecs);

                if (Object.keys(filteredRecs).length != 0) {
                    this.sibilingsCommService.pushNotification('selectOnClick', filteredRecs[0]);
                }

            } catch (error) {

            }

        });

    }

    autoLiking(toggleState) {

        this.toggleStateAutoLiking = toggleState;

        localStorage.setItem('auto_like_state', String(this.toggleStateAutoLiking));

        HomeComponent.toggleStateAutoLiking = toggleState;

        if (toggleState) {

            getChrome().runtime.sendMessage({

                action: 'auto_like_state',

                source: String(toggleState)

            });

        } else {

        }
    }

    ngOnDestroy(): void {

    }

}
