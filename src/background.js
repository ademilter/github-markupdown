

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	//her sayfa açıldığında tetiklenecek
	 if(changeInfo.status == "complete"){ 
  		chrome.tabs.sendMessage(tabId, { text: "report_back" }); //mesaj dinleyen tablara tetiklendi.
	}

});
