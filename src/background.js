    /* 
    content script(main.js) içinde sayfa her sayfanın yüklenişini dinleyemediğim için böyle yaptım. 
    Alternatif çözümü olabilir. fazla bilgi sahibi değilim.
	
	Tahminim content scriptler sayfanın içerisinde doğrudan eklendiği için tarayıcıya ait tab eventleri 
	dinlemek mümkün olmuyor.
    */

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	//her sayfa açıldığında tetiklenecek
	 if(changeInfo.status == "complete"){ 
  		chrome.tabs.sendMessage(tabId, { text: "report_back" }); //mesaj dinleyen tablara tetiklendi.
	}

});
