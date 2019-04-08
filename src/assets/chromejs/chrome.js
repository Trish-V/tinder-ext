'use strict'

function getChrome() {

    return chrome

}

function openTinder() {


    // getChrome().tabs.create({ url: "../html/redirect.html" })

    // getChrome().browserAction.onClicked.addListener(() => {
    //     getChrome().tabs.create({ url: "www.tinder.com/_/chrome/newtab" })
    //   })
}



function backgroundDataPublish() {
    var arrayLength;
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {

            arrayLength = Object.keys( JSON.parse(this.responseText)).length;

            // console.log(this.responseText);
            console.log(arrayLength);
        }
    });

    xhr.open("GET", "../../assets/json/match_data.json");
    xhr.setRequestHeader("cache-control", "no-cache"); 

    xhr.send(data);
}