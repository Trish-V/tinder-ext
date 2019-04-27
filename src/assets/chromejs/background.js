
chrome.runtime.onMessage.addListener(function (request, sender) {

  if (request.action == "open_tinder") { // callback for liked recomendations 

    window.open("https://tinder.com", "_blank");


  }

  if (request.action == "getLocalStorage") {

    localStorage.setItem('tinder_local_storage', request.source);
    // alert(request.source)

  }

});




setTimeout(function run() {

  chrome.tabs.getSelected(null, function (tab) {

    var tablink = tab.url;

    if (tablink.includes('tinder.com')) {


      chrome.tabs.executeScript(null, { // injecting retriving dom

        file: "assets/chromejs/localstorage.js"

      }, function () {

        if (chrome.runtime.lastError) {
          // alert('error')
        }

      });

    } else {
      chrome.runtime.sendMessage({

        action: "savedLocalStorage",

        source: localStorage.getItem('tinder_local_storage')

      });
    }

  });




  setTimeout(run, 2000);
}, 2000);





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