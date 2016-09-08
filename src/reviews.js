'use strict';

var Review = require('./review');
var load = require('./load');
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsMore = document.querySelector('.reviews-controls-more');
var PAGE_SIZE = 3;
var pageNumber = 0;
var reviews = [];
var paramsObj = {};

paramsObj.from = pageNumber * PAGE_SIZE;
paramsObj.to = (pageNumber * PAGE_SIZE) + PAGE_SIZE;
paramsObj.filter = '';

var reviewsVisibilityToggle = function() {
  reviewsFilter.classList.toggle('invisible');
};

var changeFilter = function(filterID) {
  reviewsContainer.innerHTML = '';
  pageNumber = 0;
  paramsObj.filter = filterID;
  addReviews();
};

var renderReviews = function(data) {
  reviews = data;

  reviews.forEach(function(item) {
    var review = new Review(item);
    reviewsContainer.appendChild(review.element);
  });
};

var addReviews = function() {
  reviewsVisibilityToggle();

  load('http://localhost:1506/api/reviews', paramsObj, renderReviews);

  reviewsVisibilityToggle();
};

addReviews();

reviewsMore.addEventListener('click', function() {
  addReviews();
});

reviewsFilter.addEventListener('change', function(evt) {
  if(evt.target.tagName.toLowerCase() === 'input') {
    changeFilter(evt.target.id);
  }
});
