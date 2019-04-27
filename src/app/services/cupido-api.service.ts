import { Injectable } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'

import { HttpClient } from '@angular/common/http'

@Injectable()
export class CupidoAPIService {

    headers: HttpHeaders
    createProfielUrl: string
    matchDetailsSharing: string
    lastMsgIdPerMatchId: string
    host: string
    match_id: string
    saveMessagesForTheMatch: string

    constructor(private httpClient: HttpClient) {

        this.headers = new HttpHeaders()
    }

    services = {

        initCupidoAPI: () => {
            this.host = 'https://3a99fe9d.ngrok.io'
            this.createProfielUrl = '/ext/profile'
            this.matchDetailsSharing = '/ext/match'
            this.lastMsgIdPerMatchId = '/ext/'+this.match_id+'/messages'
            this.saveMessagesForTheMatch= '/ext/'+this.match_id+'/messages'

        },

        createProfile: (profile) => {

            return this.httpClient.post<any>(this.host + this.createProfielUrl, profile)

        }



    }

}