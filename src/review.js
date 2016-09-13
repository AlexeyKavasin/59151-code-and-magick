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
  this.data = data;
  this.element = this.getReviewElement(data);
  this.reviewQuizAnswerYes = this.element.querySelector('.review-quiz-answer-yes');
  this.reviewQuizAnswerNo = this.element.querySelector('.review-quiz-answer-no');
  this.onReviewQuizAnswerYes = this.onReviewQuizAnswerYes.bind(this);
  this.onReviewQuizAnswerNo = this.onReviewQuizAnswerNo.bind(this);
  this.reviewQuizAnswerYes.addEventListener('click', this.onReviewQuizAnswerYes);
  this.reviewQuizAnswerNo.addEventListener('click', this.onReviewQuizAnswerNo);
};


Review.prototype = {
  getReviewElement: function(review) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.review-text').textContent = review.description;
    var starsBlock = element.querySelector('span.review-rating');

    switch(review.rating) {
      case 2:
        starsBlock.style.width = '80px';
        break;
      case 3:
        starsBlock.style.width = '120px';
        break;
      case 4:
        starsBlock.style.width = '160px';
        break;
      case 5:
        starsBlock.style.width = '200px';
        break;
      default:
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
  onReviewQuizAnswerYes: function() {
    this.reviewQuizAnswerYes.classList.add('review-quiz-answer-active');
    if(this.reviewQuizAnswerNo.classList.contains('review-quiz-answer-active')) {
      this.reviewQuizAnswerNo.classList.remove('review-quiz-answer-active');
    }
  },
  onReviewQuizAnswerNo: function() {
    this.reviewQuizAnswerNo.classList.add('review-quiz-answer-active');
    if(this.reviewQuizAnswerYes.classList.contains('review-quiz-answer-active')) {
      this.reviewQuizAnswerYes.classList.remove('review-quiz-answer-active');
    }
  },
  remove: function() {
    this.reviewQuizAnswerYes.removeEventListener('click', this.onReviewQuizAnswerYes);
    this.reviewQuizAnswerNo.removeEventListener('click', this.onReviewQuizAnswerNo);
  }
};

module.exports = Review;
