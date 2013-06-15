/**
* Script for background page of Baidu Cloud Pinyin Chrome Extension
* Author: y_cn(andiycn@gmail.com) 2011/02/03
*/

// default state
var state = 'open';
var enabled = true;

function loadOptions() {
    state = localStorage['state'] ? localStorage['state'] : 'open';
    enabled = (state == 'open');
}

function setState(enabled) {
    localStorage['state'] = enabled ? "open" : "close";
    chrome.browserAction.setIcon({
        path : enabled 
            ? "icon_enabled.png" 
            : "icon_disabled.png"});
    chrome.browserAction.setTitle({
        title : enabled 
            ? "Disable Baidu Clound Pinyin" 
            : "Enable Baidu Clound Pinyin"});
    notifyAllTabs();
}

function notifyAllTabs() {
    chrome.windows.getAll({populate:true}, function(windows){
        for (i=0; i<windows.length; i++) {
            for (j=0; j<windows[i].tabs.length; j++) {
                var tab = windows[i].tabs[j];
                chrome.tabs.sendRequest(tab.id,
                    {target: 'content', action: localStorage['state']},
                    function(response){});
            }
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab){
    enabled = !enabled;
    setState(enabled);
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        try {
            if (request.target == 'bg') {
                if (request.action == 'state') {
                    sendResponse({state: localStorage['state']});
                    return;
                }
                else if (request.action == 'open') {
                    enabled = true;
                    setState(enabled);
                }
                else if (request.action == 'close') {
                    enabled = false;
                    setState(enabled);
                }
                else if (request.action == 'toggle') {
                    enabled = !enabled;
                    setState(enabled);
                }
            }
        } catch (e) {}
        sendResponse({}); // clean up
    });

loadOptions();
setState(enabled);