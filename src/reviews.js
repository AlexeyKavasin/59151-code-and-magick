'use strict';

window.__jsonpCallback = function(data) {
  window.reviews = data;
};

var callbackFunc = function(data) {
  window.__jsonpCallback(data);
};

var implementJson = function(httpReq, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = httpReq;
  document.body.appendChild(scriptEl);
  callback();
};

implementJson('http://localhost:1506/api/reviews?callback=__jsonpCallback', callbackFunc);
