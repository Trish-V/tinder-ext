import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TinderAPI {

    headers: Headers;

    matches_url;

    messages_url;

    match_list = [];

    profile_url;

    matchId;

    static t_token: string;

    recs_url: string;

    fb_auth_url: string;

    constructor(private httpClient: HttpClient) {
        this.headers = new Headers();
    }


    services = {
        init: () => {
            this.headers.append('Accept', 'application/json');
            this.headers.append('app-version', '1020333');
            this.headers.append('Content-Type', 'application/json');
            this.headers.append('Origin', 'https://tinder.com');
            this.headers.append('platform', 'web');
            this.headers.append('Referer', 'https://tinder.com');
            this.headers.append('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
            this.headers.append('x-supported-image-formats', 'webp,jpeg');
            this.headers.append('x-auth-token', TinderAPI.t_token);


            this.matches_url = "https://api.gotinder.com/v2/matches";
            this.messages_url = "https://api.gotinder.com/v2/matches/" + this.matchId + "/messages";
            this.profile_url = "https://api.gotinder.com/profile";
            this.recs_url = "https://api.gotinder.com/user/recs";
            this.fb_auth_url = "https://api.gotinder.com/auth";
        },
        initTinderToken: (t_token: string) => {
            this.headers.append('Accept', 'application/json');
            this.headers.append('app-version', '1020333');
            this.headers.append('Content-Type', 'application/json');
            this.headers.append('Origin', 'https://tinder.com');
            this.headers.append('platform', 'web');
            this.headers.append('Referer', 'https://tinder.com');
            this.headers.append('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
            this.headers.append('x-supported-image-formats', 'webp,jpeg');
            this.headers.append('x-auth-token', TinderAPI.t_token = t_token);


            this.matches_url = "https://api.gotinder.com/v2/matches";
            this.messages_url = "https://api.gotinder.com/v2/matches/" + this.matchId + "/messages";
            this.profile_url = "https://api.gotinder.com/profile";
            this.recs_url = "https://api.gotinder.com/user/recs";
            this.fb_auth_url = "https://api.gotinder.com/auth";
        },

        get_match_list: (pagination_token = "start") => {
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

            return this.httpClient.get<any>(this.matches_url, { headers: new HttpHeaders(JSON.stringify(this.headers)), params: params })

        },

        get_match_message: (matchId: string, pagination_token = "start") => {
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

            this.messages_url = "https://api.gotinder.com/v2/matches/" + matchId + "/messages";

            return this.httpClient.get<any>(this.messages_url, { headers: new HttpHeaders(JSON.stringify(this.headers)), params: params })

        },

        get_matches_of_the_firstpage: () => {
            let params = {

                "count": "60",

                "locale": "en",

                "message": "1"

            }

            return this.httpClient.get<any>(this.matches_url, { headers: new HttpHeaders(JSON.stringify(this.headers)), params: params })

        },

        get_profile_of_the_logged_in_user: () => {

            return this.httpClient.get<any>(this.profile_url, { headers: new HttpHeaders(JSON.stringify(this.headers)) })

        },
        authenticate_with_fb: () => {

            return this.httpClient.get<any>(this.fb_auth_url, { headers: new HttpHeaders(JSON.stringify(this.headers)) })

        },

        get_all_recomendations: () => {

            return this.httpClient.get<any>(this.recs_url, { headers: new HttpHeaders(JSON.stringify(this.headers)) })
        }

    };









}