

 




class Main {



    token

    match_list = []

    host = 'https://e752a67a.ngrok.io'
    hostLocal = 'http://localhost:3000'

    tinderService = new TinderService();

    cupidoService = new CupidoService(this.host);

    constructor(token) {

        
        try {
            this.tinderService = new TinderService();

            this.cupidoService = new CupidoService(this.host);

            this.token = token;
            this.getMatchList();

        } catch (error) {
          
        }

    }

    getMatchList(pagination_token = "start") {
 

        this.tinderService.getMatchesOfTheUserFirstPage({ count: 60, locale: 'en', message: 1, token: this.token }, res => {
            
            this.saveMatches(res)


        });

    }


    saveMatches(matches) {
        var matchesArray = []
        matchesArray = JSON.parse(matches).data.matches
 
        if (typeof matchesArray !== 'undefined')
            matchesArray.forEach(match => {
                match['platform_user_id'] = localStorage.getItem('platform_user_id').toString()
                 
                this.saveMatch(match)
            })




    }

    saveMatch(match) { 
        this.cupidoService.saveMatch(match, res => {

            this.getMessageListForTheMatch(res)
        })

    }

    getMessageListForTheMatch(match) { 
        if (typeof JSON.parse(match).data._id !== 'undefined')
            this.cupidoService.messageIdListForTheMatch(JSON.parse(match).data._id, res => {

                this.saveMessageForMatch(res, JSON.parse(match).data._id)

            })
    }

    saveMessageForMatch(list, match_id) {

        var msgArray = []
        var next_page_token = ''

        this.tinderService.getMessagesOfTheFirstPage({ count: 60, locale: 'en', match_id: match_id, token: this.token }, res => {

            msgArray = JSON.parse(res).data.messages
            next_page_token = JSON.parse(res).data.next_page_token

            if (typeof JSON.parse(res).data.messages !== 'undefined') {

                JSON.parse(list).data.forEach(msgid => {

                    JSON.parse(res).data.messages.forEach(message => {

                        if (String(msgid).match(String(message._id))) {

                            msgArray.splice(
                                msgArray.indexOf({ _id: message._id }),
                                1
                            )

                        }

                    })

                })
 
                msgArray.forEach(msg => {
                    this.cupidoService.saveMessage(match_id, msg, res => {
 

                    })
                })
                if (Object.keys(msgArray).length === 0) { 

                    if (typeof next_page_token !== 'undefined') {
                        this.saveMessageSecondPageForMatch(list, match_id, next_page_token)
                    }
                }

            }

        })
    }



    saveMessageSecondPageForMatch(list, match_id, next_page_token, page = 2) {
        var msgArray = []
        var next_page_token2 = ''

        this.tinderService.getMessagesOfTheUserSecondPage({ count: 60, locale: 'en', match_id: match_id, token: this.token, page_token: next_page_token }, res => {

            msgArray = JSON.parse(res).data.messages
            next_page_token2 = JSON.parse(res).data.next_page_token

            if (typeof JSON.parse(res).data.messages !== 'undefined') {

                JSON.parse(list).data.forEach(msgid => {

                    JSON.parse(res).data.messages.forEach(message => {

                        if (String(msgid).match(String(message._id))) {

                            msgArray.splice(
                                msgArray.indexOf({ _id: message._id }),
                                1
                            )

                        }

                    })

                })
 
                msgArray.forEach(msg => {
                    this.cupidoService.saveMessage(match_id, msg, res => {
 

                    })
                })
                if (Object.keys(msgArray).length === 0) {
 

                    if (typeof next_page_token2 !== 'undefined') {
                        this.saveMessageSecondPageForMatch(list, match_id, next_page_token2, ++page)
                    }
                    // this.saveMessageSecondPageForMatch(list, match_id, next_page_token)
                }

            }

        })
    }

}