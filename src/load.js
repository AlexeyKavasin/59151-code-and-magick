'use strict';

window.__jsonpCallback = function(data) {
  window.reviews = data;
};

var load = function(httpReq, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = httpReq + '__jsonpCallback';
  scriptEl.onload = callback;
  document.body.appendChild(scriptEl);
};

module.exports = load;
