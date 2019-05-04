
 
var msgService = new TinderMessages();
getMatchList();
function getMatchList() {

    msgService.getMatchesOfTheUserFirstPage({ token: '2f231359-3cc8-45dd-a1b1-909b942bc5d1' }, (res) => {
        alert(res)
    });


}





