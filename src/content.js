/**
* Content script of Baidu Cloud Pinyin Chrome Extension
* Author: y_cn(andiycn@gmail.com) 2011/02/03
*/

function bdimeInit() {
    console.log('bdimeInit...'+localStorage['state']);
    var enabled = (localStorage['state'] == 'open');
    var head = document.getElementsByTagName('head')[0];
    
    var element = document.createElement('script');
    element.id = "__bdime";
    element.type = "text/javascript";
    element.innerHTML = (enabled
                ? 'var bdime_option = {on:true};'
                : 'var bdime_option = {on:false};');
    head.appendChild(element);
    
    var element = document.createElement('script');
    element.type = "text/javascript";
    element.src = "http://www.baidu.com/olime/bdime_open.js";
    head.appendChild(element);
}

function executeScript(code) {
    var head = document.getElementsByTagName('head')[0];
    var element = document.createElement('script');
    element.type = "text/javascript";
    element.innerHTML = code;
    head.appendChild(element);
}

function bdimeOpen() {
    executeScript("bdime.open();");
}

function bdimeClose() {
    executeScript("bdime.close();");
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        try {
            if (request.target == 'content') {
                if (request.action == 'open') {
                    bdimeOpen();
                }
                else if (request.action == 'close') {
                    bdimeClose();
                }
            }
        } catch (e) {}
        sendResponse({});
    });

if (typeof(loaded) == 'undefined') {
    loaded = true;    
    chrome.extension.sendRequest(
        {target: 'bg', action: 'state'}, 
        function(response){
            localStorage['state'] = response.state;
            bdimeInit();
        });
        
    // hotkey: ctrl + alt + `(192)
    document.onkeydown = function(e) {
        e = e || window.event;
        var keycode = e.which || e.keyCode || e.charCode;
        if (e.ctrlKey && keycode == 192) {
            chrome.extension.sendRequest(
                {target: 'bg', action: 'toggle'}, 
                function(response){});
        }
    };
}