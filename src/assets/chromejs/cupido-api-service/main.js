


// tinderService.getMatchesOfTheUserFirstPage({ token: '2f231359-3cc8-45dd-a1b1-909b942bc5d1' }, (res) => {
//     alert(res)
// });







class Main {



    token

    match_list = []

    host = 'https://e752a67a.ngrok.io'
    hostLocal = 'http://localhost:3000'

    tinderService = new TinderService();

    cupidoService = new CupidoService(this.host);

    constructor(token) {

        console.log('main')
        try {
            this.tinderService = new TinderService();

            this.cupidoService = new CupidoService(this.host);

            this.token = token;
            this.getMatchList();

        } catch (error) {
            console.log(error)
        }

    }

    getMatchList(pagination_token = "start") {

        console.log('getMatchList')

        this.tinderService.getMatchesOfTheUserFirstPage({ count: 60, locale: 'en', message: 1, token: this.token }, res => {
            // console.log( JSON.stringify  ( JSON.parse (res).data.matches[0] )     )
            this.saveMatches(res)


        });

    }


    saveMatches(matches) {
        var matchesArray = []
        matchesArray = JSON.parse(matches).data.matches

        // console.log(JSON.stringify(JSON.parse(matches).data.matches))
        if (typeof matchesArray !== 'undefined')
            matchesArray.forEach(match => {
                match['platform_user_id'] = localStorage.getItem('platform_user_id').toString()
                // console.log(JSON.stringify(match, null, 3));

                this.saveMatch(match)
            })




    }

    saveMatch(match) {
        // console.log(JSON.stringify(match, null, 4))
        this.cupidoService.saveMatch(match, res => {

            this.getMessageListForTheMatch(res)
        })

    }

    getMessageListForTheMatch(match) {
        // console.log('_id main : ' + JSON.parse(match).data._id)
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

                console.log(msgArray)
                msgArray.forEach(msg => {
                    this.cupidoService.saveMessage(match_id, msg, res => {

                        console.log('MSG Saved : ' + res)

                    })
                })
                if (Object.keys(msgArray).length === 0) {
                    console.log('1st page published , next page token : ' + next_page_token)

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

                console.log(msgArray)
                msgArray.forEach(msg => {
                    this.cupidoService.saveMessage(match_id, msg, res => {

                        console.log('MSG Saved : ' + res)

                    })
                })
                if (Object.keys(msgArray).length === 0) {

                    console.log(' page ' + page + ' published , next page token : ' + next_page_token2)

                    if (typeof next_page_token2 !== 'undefined') {
                        this.saveMessageSecondPageForMatch(list, match_id, next_page_token2, ++page)
                    }
                    // this.saveMessageSecondPageForMatch(list, match_id, next_page_token)
                }

            }

        })
    }

}