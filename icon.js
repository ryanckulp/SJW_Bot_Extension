// Called when user clicks the SJW icon 'browser action'
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({"url": "https://github.com/ryanckulp/SJW_Bot_Extension"});
});
