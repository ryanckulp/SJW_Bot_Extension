// Called when user clicks on the Distribute icon 'browser action'
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({"url": "http://quote.distribute.com"});
});
