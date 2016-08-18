'use strict';

var reviews = [];
var httpRequest = 'http://localhost:1506/api/reviews?callback=__jsonpCallback';

var __jsonpCallback = function(data) {
  reviews = data;
};

var implementJson = function(httpReq, func) {
  var scriptEl = document.createElement('script');
  scriptEl.src = httpReq;
  document.body.appendChild(scriptEl);
  func();
  return reviews;
};

implementJson(httpRequest, __jsonpCallback);
