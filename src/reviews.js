'use strict';

var IMAGE_LOAD_TIMEOUT = 10000;
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var templateElement = document.querySelector('#review-template');
var elementToClone;
var reviews = [];

window.__jsonpCallback = function(data) {
  reviews = data;
};

var callbackFunc = function() {
  reviews.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
  });
};

var implementJson = function(httpReq, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = httpReq;
  scriptEl.onload = callback;
  document.body.appendChild(scriptEl);
};

var reviewsVisibilityToggle = function() {
  reviewsFilter.classList.toggle('invisible');
};

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

var getReviewElement = function(review, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.review-text').textContent = review.description;

  container.appendChild(element);

  var img = new Image();
  var imgLoadTimeout;
  var imgContent = element.querySelector('img.review-author');

  img.onload = function(evt) {
    clearTimeout(imgLoadTimeout);
    imgContent.src = evt.target.src;
    imgContent.alt = 'Изображение пользователя';
    imgContent.width = 124;
    imgContent.height = 124;
  };

  img.onerror = function() {
    element.classList.add('review-load-failure');
  };

  img.src = review.author.picture;
  imgLoadTimeout = setTimeout(function() {
    img.src = '';
    element.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
};

var addReviews = function() {
  reviewsVisibilityToggle();

  implementJson('http://localhost:1506/api/reviews?callback=__jsonpCallback', callbackFunc);

  reviewsVisibilityToggle();
};

addReviews();
