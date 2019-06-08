chrome.runtime.sendMessage({

    action: "getLocalStorage",

    source: getAccess()

});

function getAccess() {

    // alert(localStorage);

    return JSON.stringify(localStorage); //[key]

}

