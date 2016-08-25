'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var getReviewElement = require('./review');
var load = require('./load');

var reviewsVisibilityToggle = function() {
  reviewsFilter.classList.toggle('invisible');
};

var addReviews = function() {
  reviewsVisibilityToggle();

  load('http://localhost:1506/api/reviews?callback=', function() {
    window.reviews.forEach(function(review) {
      getReviewElement(review, reviewsContainer);
    });
  });

  reviewsVisibilityToggle();
};

addReviews();
