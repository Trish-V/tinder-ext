import { Injectable } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'

import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class CupidoAPIService {

    headers: HttpHeaders
    createProfielUrl: string
    matchDetailsSharing: string
    lastMsgIdPerMatchId: string
    host: string
    match_id: string
    saveMessagesForTheMatch: string
    state: any;

    constructor(private httpClient: HttpClient) {

        this.headers = new HttpHeaders()
    }

    services = {

        initCupidoAPI: (state) => {
            this.state = state
            this.host = 'https://e752a67a.ngrok.io'
            this.createProfielUrl = '/ext/profiles'
            this.matchDetailsSharing = '/ext/match'
            this.lastMsgIdPerMatchId = '/ext/' + this.match_id + '/messages'
            this.saveMessagesForTheMatch = '/ext/' + this.match_id + '/messages'

        },

        createProfile: (profile): Observable<any> => {
            
            
            if (this.state)
                return this.httpClient.post<any>(this.host + this.createProfielUrl, profile,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

        }



    }

}