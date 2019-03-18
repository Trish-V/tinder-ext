
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