'use strict';

var activePicture = 0;

var Gallery = function(pictures) {
  var self = this;

  this.pictures = pictures;
  this.galleryContainer = document.querySelector('.overlay-gallery');
  this.galleryImgContainer = document.querySelector('.overlay-gallery-preview');
  this.galleryPrevious = document.querySelector('.overlay-gallery-control-left');
  this.galleryNext = document.querySelector('.overlay-gallery-control-right');
  this.galleryCurrent = document.querySelector('.preview-number-current');
  this.galleryTotal = document.querySelector('.preview-number-total');
  this.galleryClose = document.querySelector('.overlay-gallery-close');
  this.activePicture = activePicture;

  this.onGalleryClose = function() {
    self.hide();
  };
  this.onGalleryNext = function() {
    var limitMax = pictures.length - 1;
    if(self.activePicture >= limitMax) {
      self.activePicture = limitMax;
    } else {
      self.setActivePicture(self.activePicture + 1);
    }
  };
  this.onGalleryPrevious = function() {
    var limitMin = 0;
    if(self.activePicture <= limitMin) {
      self.activePicture = limitMin;
    } else {
      self.setActivePicture(self.activePicture - 1);
    }
  };
};

Gallery.prototype.show = function(num) {
  this.galleryContainer.classList.remove('invisible');
  this.setActivePicture(num);
  this.galleryClose.addEventListener('click', this.onGalleryClose);
  this.galleryNext.addEventListener('click', this.onGalleryNext);
  this.galleryPrevious.addEventListener('click', this.onGalleryPrevious);
};

Gallery.prototype.hide = function() {
  this.galleryContainer.classList.add('invisible');
  this.galleryClose.removeEventListener('click', this.onGalleryClose);
  this.galleryNext.removeEventListener('click', this.onGalleryNext);
  this.galleryPrevious.removeEventListener('click', this.onGalleryPrevious);
};

Gallery.prototype.setActivePicture = function(num) {
  this.activePicture = num;

  var img = new Image();
  img.src = this.pictures[this.activePicture];

  if(this.img) {
    this.galleryImgContainer.removeChild(this.img);
    this.galleryImgContainer.appendChild(img);
  } else {
    this.galleryImgContainer.appendChild(img);
  }

  this.img = img;


  this.galleryCurrent.textContent = this.activePicture + 1;
  this.galleryTotal.textContent = this.pictures.length;
};

module.exports = Gallery;
