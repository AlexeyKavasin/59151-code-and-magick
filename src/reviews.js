'use strict';

var Review = require('./review');
var load = require('./load');
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsMore = document.querySelector('.reviews-controls-more');
var PAGE_SIZE = 3;
var pageNumber = 0;
var reviews = [];
var currentFilter = localStorage.getItem('filterID') || 'reviews-all';
document.querySelector('#' + currentFilter).checked = true;

var reviewsVisibilityToggle = function() {
  reviewsFilter.classList.toggle('invisible');
};

var renderReviews = function(data) {
  reviews = data;

  reviews.forEach(function(item) {
    var review = new Review(item);
    reviewsContainer.appendChild(review.element);
  });

  if(!reviews.length) {
    reviewsMore.classList.add('invisible');
  } else {
    reviewsMore.classList.remove('invisible');
  }
};

var changeFilter = function(filterID) {
  reviewsContainer.innerHTML = '';
  pageNumber = 0;
  currentFilter = filterID;
  localStorage.setItem('filterID', currentFilter);
  addReviews();
};

var addReviews = function() {
  reviewsVisibilityToggle();

  load('http://localhost:1506/api/reviews', {
    from: pageNumber * PAGE_SIZE,
    to: (pageNumber * PAGE_SIZE) + PAGE_SIZE,
    filter: currentFilter
  }, renderReviews);
  pageNumber++;

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
