'use strict';

window.form = (function() {
  var reviewForm = document.querySelector('.review-form');
  // var reviewMark = document.querySelectorAll('input[name="review-mark"]');
  var reviewMark = reviewForm.elements['review-mark'];
  var reviewName = document.querySelector('#review-name');
  var reviewLabelName = document.querySelector('.review-fields-name');
  var reviewText = document.querySelector('#review-text');
  var reviewLabelText = document.querySelector('.review-fields-text');
  var submit = document.querySelector('.review-submit');
  var reviewFieldsBlock = document.querySelector('.review-fields');
  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');
  reviewName.required = true;
  reviewLabelText.style.visibility = 'hidden';
  submit.disabled = true;


  function disableSubmit() {
    if (reviewMark.value < 3) {
      reviewText.required = true;
      reviewLabelText.style.visibility = 'visible';
    } else {
      reviewText.required = false;
      reviewLabelText.style.visibility = 'hidden';
    }

    if(reviewText.validity.valid) {
      reviewLabelText.style.visibility = 'hidden';
    } else {
      reviewLabelText.style.visibility = 'visible';
    }

    if(reviewName.validity.valid) {
      reviewLabelName.style.visibility = 'hidden';
    } else {
      reviewLabelName.style.visibility = 'visible';
    }

    if(reviewName.validity.valid && reviewText.validity.valid) {
      reviewFieldsBlock.style.visibility = 'hidden';
    } else {
      reviewFieldsBlock.style.visibility = 'visible';
    }

    submit.disabled = !(reviewText.validity.valid && reviewName.validity.valid);
  }

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  reviewName.oninput = function() {
    disableSubmit();
  };

  reviewText.oninput = function() {
    disableSubmit();
  };

  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].onchange = function() {
      disableSubmit();
    };
  }

  var form = {
    onClose: null,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };

  return form;

})();
