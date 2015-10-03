/*
Daha iyi bir alternatif bir çözüm olabilir konu hakkında çok donanımlı değilim.
*/

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	//her sayfa açıldığında tetiklenecek
	 if(changeInfo.status == "complete"){ 
  		chrome.tabs.sendMessage(tabId, { text: "report_back" }); //mesaj dinleyen tablara tetiklendi.
	}

});
