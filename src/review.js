'use strict';

var IMAGE_LOAD_TIMEOUT = 10000;
var templateElement = document.querySelector('#review-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

var Review = function(data) {
  var self = this;
  this.data = data;
  this.element = this.getReviewElement(data);
  this.reviewQuizAnswerYes = this.element.querySelector('.review-quiz-answer-yes');
  this.reviewQuizAnswerNo = this.element.querySelector('.review-quiz-answer-no');

  this.onReviewQuizAnswerYes = function() {
    self.reviewQuizAnswerYes.classList.add('review-quiz-answer-active');
    if(self.reviewQuizAnswerNo.classList.contains('review-quiz-answer-active')) {
      self.reviewQuizAnswerNo.classList.remove('review-quiz-answer-active');
    }
  };

  this.onReviewQuizAnswerNo = function() {
    self.reviewQuizAnswerNo.classList.add('review-quiz-answer-active');
    if(self.reviewQuizAnswerYes.classList.contains('review-quiz-answer-active')) {
      self.reviewQuizAnswerYes.classList.remove('review-quiz-answer-active');
    }
  };

  this.reviewQuizAnswerYes.addEventListener('click', this.onReviewQuizAnswerYes);
  this.reviewQuizAnswerNo.addEventListener('click', this.onReviewQuizAnswerNo);
};


Review.prototype = {
  getReviewElement: function(review) {
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
  },

  remove: function() {
    this.reviewQuizAnswerYes.removeEventListener('click', this.onReviewQuizAnswerYes);
    this.reviewQuizAnswerNo.removeEventListener('click', this.onReviewQuizAnswerNo);
  }
};

module.exports = Review;
