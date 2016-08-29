'use strict';

var galleryContainer = document.querySelector('.overlay-gallery');
var galleryImgContainer = document.querySelector('.overlay-gallery-preview');
var galleryPrevious = document.querySelector('.overlay-gallery-control-left');
var galleryNext = document.querySelector('.overlay-gallery-control-right');
var galleryCurrent = document.querySelector('.preview-number-current');
var galleryTotal = document.querySelector('.preview-number-total');
var galleryClose = document.querySelector('.overlay-gallery-close');
var pics = document.querySelectorAll('.photogallery-image img');
var activePicture = 0;

var Gallery = function(pictures) {
  var self = this;

  this.pictures = pictures;
  self.galleryContainer = galleryContainer;
  self.galleryImgContainer = galleryImgContainer;
  self.galleryPrevious = galleryPrevious;
  self.galleryNext = galleryNext;
  self.galleryCurrent = galleryCurrent;
  self.galleryTotal = galleryTotal;
  self.galleryClose = galleryClose;
  self.activePicture = activePicture;

  this.onGalleryClose = function() {
    self.hide();
  };
  this.onGalleryNext = function() {
    activePicture++;
  };
  this.onGalleryPrevious = function() {
    activePicture--;
  };
  for(var i = 0; i < pics.length; i++) {
    pics[i].onclick = function() {
      self.show(self.pictures.indexOf(this.src));
    };
  }
};

Gallery.prototype.show = function(num) {
  this.galleryContainer.classList.remove('invisible');
  this.setActivePicture(num);

  this.galleryClose.onclick = function() {
    self.onGalleryClose();
  };
  this.galleryNext.onclick = function() {
    self.onGalleryNext();
  };
  this.galleryPrevious.onclick = function() {
    self.onGalleryPrevious();
  };
};

Gallery.prototype.hide = function() {
  this.galleryContainer.classList.add('invisible');
  this.galleryClose.onclick = null;
  this.galleryNext.onclick = null;
  this.galleryPrevious.onclick = null;
};

Gallery.prototype.setActivePicture = function(num) {
  this.galleryImgContainer.innerHTML = '';
  this.activePicture = num;
  var galleryImg = document.createElement('img');
  this.galleryImgContainer.appendChild(galleryImg);
  galleryImg.src = this.pictures[num];
  galleryImg.style.width = '100%';
  console.log(this.pictures, num);

  this.galleryCurrent.textContent = this.activePicture;
};

module.exports = Gallery;
