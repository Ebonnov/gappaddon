const widgets = require("widget");
const tabs = require("tabs");
const {Cc, Ci} = require("chrome");

const prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);  
var curStatus = 0;
var proxyExePath = "D:\\Tools\\localproxy\\proxy.exe";
var data = require("self").data;

var input = require("panel").Panel({
width: 200,
height: 200,
contentURL: data.url("input.html"),
contentScriptFile: data.url("input.js")
});

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    work();
    }
});

var widget2 = widgets.Widget({
id: "myPref",
label: "Preferences",
content: "Pref",
panel: input
});

function start() {
    curStatus = 0;
}

function work() {
    console.log("work!");
    console.log(curStatus);
    var nextStatus;
    if (curStatus == 0)
    {
	prepare();
	turnOn();
	nextStatus = 2;
    }
    else if (curStatus == 1)
    {
	turnOn();
	nextStatus = 2;
    }
    else if (curStatus == 2)
    {
	turnOff();
	nextStatus = 1;
    }
    curStatus = nextStatus;
}

function prepare() {
    var proxyExe = Components.classes["@mozilla.org/file/local;1"]. 
	           createInstance(Components.interfaces.nsILocalFile);
    proxyExe.initWithPath(proxyExePath);
    console.log("starting proxy.exe...");
    proxyExe.launch();
    console.log("Done!");
}

function turnOn() {
    prefService.setIntPref("network.proxy.type", 1);
    prefService.setCharPref("network.proxy.http", "localhost");
    prefService.setIntPref("network.proxy.http_port", 8000);
}

function turnOff() {
    prefService.setIntPref("network.proxy.type", 5);
}

input.on("show", function() {
	input.port.emit("show", proxyExePath);
	});

input.port.on("text-entered", function(text) {
	proxyExePath = text;
	console.log(proxyExePath);
	});

// function work() {
//     console.log("requiring httpd");
//     var {nsHttpServer} = require("httpd");
//     daemon = new nsHttpServer();
// 
//     console.log("registering handler");
//     daemon.registerPathHandler("/", function(request, response){
// 	    console.log("Haha");
// 	    });
//     console.log("starting");
//     daemon.start(22333);
// 
//     console.log("The add-on is running.");
// }
// 
// function myPrefixHandler(request, response) {
//     response.setStatusLine(request.httpVersion, 404, "Sigmund");
//     console.log("Here. Stopping daemon");
//     daemon.stop();
// }

// function work() {
//     var http = require('http');
// 
//     http.createServer(function(request, response) {
// 	console.log("Gotcha request!");
// 	var proxy = http.createClient(80, request.headers['host']);
// 	var proxy_request = proxy.request(request.method, request.url, request.headers);
// 	proxy_request.addListener('response', function (proxy_response) {
// 	    proxy_response.addListener('data', function(chunk) {
// 		response.write(chunk, 'binary');
// 	    });
// 	    proxy_response.addListener('end', function() {
// 		response.end();
// 	    });
// 	    response.writeHead(proxy_response.statusCode, proxy_response.headers);
// 	});
// 	request.addListener('data', function(chunk) {
// 	    proxy_request.write(chunk, 'binary');
// 	});
// 	request.addListener('end', function() {
// 	    proxy_request.end();
// 	});
//     }).listen(22333);
// }
