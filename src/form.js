'use strict';

window.form = (function() {
  var reviewMark = document.querySelectorAll('input[name="review-mark"]');
  var reviewName = document.querySelector('#review-name');
  var reviewLabelName = document.querySelector('.review-fields-name');
  var reviewText = document.querySelector('#review-text');
  var reviewLabelText = document.querySelector('.review-fields-text');
  var submit = document.querySelector('.review-submit');
  var reviewFieldsBlock = document.querySelector('.review-fields');

  reviewName.required = true;
  // reviewMark.value = 1;
  // reviewName.value = 'Aleksey';
  // reviewText.value = 'Игра норм!';
  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].onchange = disableSubmit();
  }
  reviewName.oninput = disableSubmit();
  reviewText.oninput = disableSubmit();

  function disableSubmit() {
    console.log(12);
    reviewText.required = reviewMark.value < 3;
    submit.disabled = !(reviewText.validity.valid && reviewName.validity.valid);

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
  }

  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');

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

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };

  return form;

})();
