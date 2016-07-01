
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.

    console.log("Tabs are: ", tabs);

    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}


function renderStatus(statusText) {
  alert(statusText);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo.status == 'complete' && tab.active){
    getCurrentTabUrl(function(url){

      //check if url is amazon.com
      if(url.indexOf("www.amazon.com") > -1){
        chrome.tabs.executeScript(tabId, {file: "content.js"});
      }
      else if(url.indexOf("www.target.com") > -1){
        chrome.tabs.executeScript(tabId, {file: "targetContent.js"});
      }
      else if(url.indexOf("www.bestbuy.com") > -1){
        chrome.tabs.executeScript(tabId, {file: "bestbuyContent.js"});
      }
      else if(url.indexOf("www.walmart.com") > -1){
        chrome.tabs.executeScript(tabId, {file: "walmartContent.js"});
      }
    })
  }
})
