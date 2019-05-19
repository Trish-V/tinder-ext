import { Injectable } from '@angular/core';


declare var getChrome: any
@Injectable()
export class ChromeStorageService {

    setItem(keyValue) {
        getChrome().storage.local.set(keyValue, function () { 
        });
    }

    getItem(key, subscribe) {
        getChrome().storage.local.get(key, function (result) { 
            subscribe(result)
        });

    }

}