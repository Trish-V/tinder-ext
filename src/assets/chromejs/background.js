
chrome.runtime.onMessage.addListener(function (request, sender) {

  if (request.action == "open_tinder") { // callback for liked recomendations 

    window.open("https://tinder.com", "_blank");


  }

  if (request.action == "getLocalStorage") {

    localStorage.setItem('tinder_local_storage', request.source);
    // alert(request.source)

  }
  if (request.action == "is_registered_to_cupido") {
    // callback for local storage  
    localStorage.setItem('is_registered_to_cupido', request.source)
  }

  if (request.action == "platform_user_id") {
    // callback for local storage  
    localStorage.setItem('platform_user_id', String(request.source))

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



// var messages= new TinderMessages();


setTimeout(function run() {
  try {
    if (localStorage.getItem('is_registered_to_cupido').toString().match('true')) {
      var main = new Main(JSON.parse(localStorage.getItem('tinder_local_storage'))['TinderWeb/APIToken']);

    }

  } catch (error) {

  }
  console.log('running...cupido')

  setTimeout(run, 30000);
}, 1000);


