


// msgService.getMatchesOfTheUserFirstPage({ token: '2f231359-3cc8-45dd-a1b1-909b942bc5d1' }, (res) => {
//     alert(res)
// });







class Main {

    msgService = new TinderMessages();
    token
    match_list = []
    constructor(token) {

        try {
            this.msgService = new TinderMessages();

            this.token = token;
            this.getMatchList();

        } catch (error) {

        }

    }

    getMatchList() {

        this.msgService.getMatchesOfTheUserFirstPage({ count: 60, locale: 'en', message: 1, token: this.token }, (res) => {

           

            console.log(res)

            if (typeof JSON.parse(res).data.pagination_token === undefined) {

            }else{
                this.match_list.push(JSON.parse(res))
            }

        });

    }

}