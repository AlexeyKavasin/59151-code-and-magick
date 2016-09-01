'use strict';

require('./reviews');
var form = require('./form');
var Game = require('./game');
var Gallery = require('./gallery');
var pics = document.querySelectorAll('.photogallery-image img');
var picsLinks = document.querySelectorAll('.photogallery-image');
var picsURL = [];
var picsLinksArr = [];
var gallery = new Gallery(picsURL);

for(var j = 0; j < pics.length; j++) {
  picsURL.push(pics[j].src);
}

for(var i = 0; i < picsLinks.length; i++) {
  picsLinksArr.push(picsLinks[i]);
}

picsLinksArr.forEach(function(picslink, k) {
  picsLinks[k].onclick = function() {
    gallery.show(k);
  };
});

var game = new Game(document.querySelector('.demo'));
game.initializeLevelAndStart();
game.setGameStatus(Game.Verdict.INTRO);

var formOpenButton = document.querySelector('.reviews-controls-new');

/** @param {MouseEvent} evt */
formOpenButton.onclick = function(evt) {
  evt.preventDefault();

  form.open(function() {
    game.setGameStatus(Game.Verdict.PAUSE);
    game.setDeactivated(true);
  });
};

form.onClose = function() {
  game.setDeactivated(false);
};
