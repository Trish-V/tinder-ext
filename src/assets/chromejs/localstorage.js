
chrome.runtime.sendMessage({

    action: "getLocalStorage",
    
    source: getAccess()

});
function getAccess() {

    console.log(localStorage);

    return JSON.stringify(localStorage); //[key]

}

