/*


    getChrome().tabs.getSelected(null, function (tab) {

        var tablink = tab.url;
  
        if (tablink.includes('tinder.com')) {
  
          // alert('welcome')
  
        } else {
          getChrome().runtime.sendMessage({
  
            action: "open_tinder",
        
            source: 'open_tinder'
        
        });
          // alert('It\'s not tinder');
  
        }
  
      });
  
  
      getChrome().runtime.onMessage.addListener(function (request, sender) {
  
        if (request.action == "getSource") { // callback for liked recomendations 
  
          this.context.profileDataSet = JSON.parse(request.source);
  
          alert('context.profileDataSet');
  
          this.context.listOfProfiles.push(this.context.profileDataSet);
  
          // context.sibilingsCommService.pushMessage('scrollTop'); 
  
        }
  
        if (request.action == "getLocalStorage") {
  
          alert(request.source);// callback for local storage
  
        }
  
      });
  
      */


      // like all

      /* 
        getChrome().tabs.executeScript(null, { // injecting retriving dom

      file: "assets/chromejs/getDom.js"

    }, function () {

      if (getChrome().runtime.lastError) {

        // message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;

      }

    });

    */
   