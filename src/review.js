'use strict';

var IMAGE_LOAD_TIMEOUT = 10000;
var templateElement = document.querySelector('#review-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

var getReviewElement = function(review, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.review-text').textContent = review.description;

  var starsBlock = element.querySelector('span.review-rating');

  if (review.rating === 2) {
    starsBlock.style.width = '80px';
  } else if (review.rating === 3) {
    starsBlock.style.width = '120px';
  } else if (review.rating === 4) {
    starsBlock.style.width = '160px';
  } else if (review.rating === 5) {
    starsBlock.style.width = '200px';
  } else {
    starsBlock.style.width = '30px';
  }
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

module.exports = getReviewElement;
