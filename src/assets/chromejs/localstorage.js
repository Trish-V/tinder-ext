
 
//  chrome.tabs.executeScript({ 
//         code: '('+ getAccess + ')();'
//     }, (results) => { 
//         console.log(results);

        
//     });

    chrome.runtime.sendMessage({
        action: "getLocalStorage",
        source: getAccess()
    });
function getAccess() { 
    console.log(localStorage);
    return localStorage; //[key]
}    
 
