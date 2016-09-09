'use strict';


module.exports = function(list, filterID) {
  switch(filterID) {

    case 'reviews-recent':
      var THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
      return list.filter(function(item) {
        return item.created > Date.now() - THREE_DAYS;
      }).sort(function(a, b) {
        return b.created - a.created;
      });

    case 'reviews-good':
      return list.filter(function(item) {
        return item.rating >= 3;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });

    case 'reviews-bad':
      return list.filter(function(item) {
        return item.rating < 3;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });

    case 'reviews-popular':
      return list.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });

    default:
      return list;
  }
};
