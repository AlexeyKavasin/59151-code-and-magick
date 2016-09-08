'use strict';

var load = function(url, paramsObj, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

  xhr.open(
 'GET', url +
 '?from=' + paramsObj.from +
 '&to=' + paramsObj.to +
 '&filter=' + paramsObj.filter);

  xhr.send();
};

module.exports = load;
