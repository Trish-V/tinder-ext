import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class MessageRetrivalService {
    headers: Headers;
    url_matches;
    url_messages;
    match_list;
    matchId;
    constructor(private httpClient: HttpClient) {
        this.headers = new Headers();
    }

    init(t_token) {
        this.headers.append('Accept', 'application/json');
        this.headers.append('app-version', '1020333');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Origin', 'https://tinder.com');
        this.headers.append('platform', 'web');
        this.headers.append('Referer', 'https://tinder.com');
        this.headers.append('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        this.headers.append('x-supported-image-formats', 'webp,jpeg');
        this.headers.append('x-auth-token', t_token);

        this.url_matches = "https://api.gotinder.com/v2/matches";
        this.url_messages = "https://api.gotinder.com/v2/matches/" + this.matchId + "/messages";

    }

    get_match_list(pagination_token = "start") {
        let params = {
            "count": "60",
            "locale": "en",
            "message": "1"
        }

        if (pagination_token) {
            return this.match_list;
        }
        if (pagination_token == "start") {
            params["page_token"] = pagination_token
        }
        return this.httpClient.get<any>(this.url_matches, { headers: new HttpHeaders(JSON.stringify(this.headers)) })

    }


    get_match_message(match_id, pagination_token = "start") {
        let params = {
            "count": "60",
            "locale": "en",
            "message": "1"
        }

        if (pagination_token) {
            return this.match_list;
        }
        if (pagination_token == "start") {
            params["page_token"] = pagination_token
        }
        this.matchId = match_id;
        return this.httpClient.get<any>(this.url_messages, { headers: new HttpHeaders(JSON.stringify(this.headers)) })

    }



    

}