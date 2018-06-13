/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	var form = __webpack_require__(4);
	var Game = __webpack_require__(6);
	var Gallery = __webpack_require__(7);
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Review = __webpack_require__(2);
	var load = __webpack_require__(3);
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var load = function(url, paramsObj, callback) {
	  var xhr = new XMLHttpRequest();
	
	  xhr.onload = function(evt) {
	    var loadedData = JSON.parse(evt.target.response);
	    callback(loadedData);
	  };
	
	  xhr.open(
	 'GET', url +
	 '?from=' + paramsObj.from +
	 '&to=' + paramsObj.to +
	 '&filter=' + paramsObj.filter);
	
	  xhr.send();
	};
	
	module.exports = load;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var browserCookies = __webpack_require__(5);
	var cookieMark = 'review-mark';
	var cookieName = 'review-name';
	
	var reviewForm = document.querySelector('.review-form');
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
	
	reviewMark.value = browserCookies.get(cookieMark);
	reviewName.value = browserCookies.get(cookieName);
	
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
	
	reviewForm.onsubmit = function() {
	  browserCookies.set('review-mark', reviewMark.value, {expires: expireCount()});
	  browserCookies.set('review-name', reviewName.value, {expires: expireCount()});
	};
	
	var expireCount = function() {
	  var now = new Date();
	  var expireDate = new Date(now.getFullYear() - 1, 11, 9);
	  var oneDay = 1000 * 60 * 60 * 24;
	
	  if (now.getMonth() === 11 && now.getDate() > 9) {
	    expireDate.setFullYear(expireDate.getFullYear() + 1);
	  }
	
	  return Math.ceil( (now.getTime() - expireDate.getTime()) / (oneDay) );
	};
	
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
	
	module.exports = form;


/***/ },
/* 5 */
/***/ function(module, exports) {

	exports.defaults = {};
	
	exports.set = function(name, value, options) {
	  // Retrieve options and defaults
	  var opts = options || {};
	  var defaults = exports.defaults;
	
	  // Apply default value for unspecified options
	  var expires  = opts.expires || defaults.expires;
	  var domain   = opts.domain  || defaults.domain;
	  var path     = opts.path     != undefined ? opts.path     : (defaults.path != undefined ? defaults.path : '/');
	  var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
	  var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;
	
	  // Determine cookie expiration date
	  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or empty string
	  var expDate = expires == undefined ? '' :
	  // in case expires is an integer, it (should) specify the amount in days till the cookie expires
	  typeof expires == 'number' ? new Date(new Date().getTime() + (expires * 864e5)) :
	  // in case expires is (probably) a Date object
	  expires.getTime ? expires :
	  // in case expires is not in any of the above formats, try parsing as a format recognized by Date.parse()
	  new Date(expires);
	
	  // Set cookie
	  document.cookie = encodeURIComponent(name) + '=' +                          // Encode cookie name
	  value.replace(/[^#\$&\+/:<-\[\]-}]/g, encodeURIComponent) +                 // Encode cookie value (RFC6265)
	  (expDate && expDate.getTime() ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
	  (domain   ? ';domain=' + domain : '') +                                     // Add domain
	  (path     ? ';path='   + path   : '') +                                     // Add path
	  (secure   ? ';secure'           : '') +                                     // Add secure option
	  (httponly ? ';httponly'         : '');                                      // Add httponly option
	};
	
	exports.get = function(name) {
	  var cookies = document.cookie.split(';');
	
	  // Iterate all cookies
	  for(var i = 0; i < cookies.length; i++) {
	    var cookie = cookies[i];
	
	    // Determine separator index ("name=value")
	    var separatorIndex = cookie.indexOf('=');
	
	    // If a separator index is found, Decode the cookie name and compare to the requested cookie name
	    if (separatorIndex != -1 && decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g,'')) == name) {
	      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookie.length));
	    }
	  }
	
	  return null;
	};
	
	exports.erase = function(name, options) {
	  exports.set(name, '', {
	    expires:  -1,
	    domain:   options && options.domain,
	    path:     options && options.path,
	    secure:   false,
	    httponly: false}
	  );
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @const
	 * @type {number}
	 */
	var HEIGHT = 300;
	
	/**
	 * @const
	 * @type {number}
	 */
	var WIDTH = 700;
	
	/**
	 * ID уровней.
	 * @enum {number}
	 */
	var Level = {
	  INTRO: 0,
	  MOVE_LEFT: 1,
	  MOVE_RIGHT: 2,
	  LEVITATE: 3,
	  HIT_THE_MARK: 4
	};
	
	/**
	 * Порядок прохождения уровней.
	 * @type {Array.<Level>}
	 */
	var LevelSequence = [
	  Level.INTRO
	];
	
	/**
	 * Начальный уровень.
	 * @type {Level}
	 */
	var INITIAL_LEVEL = LevelSequence[0];
	
	/**
	 * Допустимые виды объектов на карте.
	 * @enum {number}
	 */
	var ObjectType = {
	  ME: 0,
	  FIREBALL: 1
	};
	
	/**
	 * Допустимые состояния объектов.
	 * @enum {number}
	 */
	var ObjectState = {
	  OK: 0,
	  DISPOSED: 1
	};
	
	/**
	 * Коды направлений.
	 * @enum {number}
	 */
	var Direction = {
	  NULL: 0,
	  LEFT: 1,
	  RIGHT: 2,
	  UP: 4,
	  DOWN: 8
	};
	
	/**
	 * Правила перерисовки объектов в зависимости от состояния игры.
	 * @type {Object.<ObjectType, function(Object, Object, number): Object>}
	 */
	var ObjectsBehaviour = {};
	
	/**
	 * Обновление движения мага. Движение мага зависит от нажатых в данный момент
	 * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
	 * На движение мага влияет его пересечение с препятствиями.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
	  // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
	  // в воздухе на определенной высоте.
	  // NB! Сложность заключается в том, что поведение описано в координатах
	  // канваса, а не координатах, относительно нижней границы игры.
	  if (state.keysPressed.UP && object.y > 0) {
	    object.direction = object.direction & ~Direction.DOWN;
	    object.direction = object.direction | Direction.UP;
	    object.y -= object.speed * timeframe * 2;
	
	    if (object.y < 0) {
	      object.y = 0;
	    }
	  }
	
	  // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
	  // опускается на землю.
	  if (!state.keysPressed.UP) {
	    if (object.y < HEIGHT - object.height) {
	      object.direction = object.direction & ~Direction.UP;
	      object.direction = object.direction | Direction.DOWN;
	      object.y += object.speed * timeframe / 3;
	    } else {
	      object.Direction = object.direction & ~Direction.DOWN;
	    }
	  }
	
	  // Если зажата стрелка влево, маг перемещается влево.
	  if (state.keysPressed.LEFT) {
	    object.direction = object.direction & ~Direction.RIGHT;
	    object.direction = object.direction | Direction.LEFT;
	    object.x -= object.speed * timeframe;
	  }
	
	  // Если зажата стрелка вправо, маг перемещается вправо.
	  if (state.keysPressed.RIGHT) {
	    object.direction = object.direction & ~Direction.LEFT;
	    object.direction = object.direction | Direction.RIGHT;
	    object.x += object.speed * timeframe;
	  }
	
	  // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
	  if (object.y < 0) {
	    object.y = 0;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }
	
	  if (object.y > HEIGHT - object.height) {
	    object.y = HEIGHT - object.height;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }
	
	  if (object.x < 0) {
	    object.x = 0;
	  }
	
	  if (object.x > WIDTH - object.width) {
	    object.x = WIDTH - object.width;
	  }
	};
	
	/**
	 * Обновление движения файрбола. Файрбол выпускается в определенном направлении
	 * и после этого неуправляемо движется по прямой в заданном направлении. Если
	 * он пролетает весь экран насквозь, он исчезает.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
	  if (object.direction & Direction.LEFT) {
	    object.x -= object.speed * timeframe;
	  }
	
	  if (object.direction & Direction.RIGHT) {
	    object.x += object.speed * timeframe;
	  }
	
	  if (object.x < 0 || object.x > WIDTH) {
	    object.state = ObjectState.DISPOSED;
	  }
	};
	
	/**
	 * ID возможных ответов функций, проверяющих успех прохождения уровня.
	 * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
	 * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
	 * нужно прервать.
	 * @enum {number}
	 */
	var Verdict = {
	  CONTINUE: 0,
	  WIN: 1,
	  FAIL: 2,
	  PAUSE: 3,
	  INTRO: 4
	};
	
	/**
	 * Правила завершения уровня. Ключами служат ID уровней, значениями функции
	 * принимающие на вход состояние уровня и возвращающие true, если раунд
	 * можно завершать или false если нет.
	 * @type {Object.<Level, function(Object):boolean>}
	 */
	var LevelsRules = {};
	
	/**
	 * Уровень считается пройденным, если был выпущен файлболл и он улетел
	 * за экран.
	 * @param {Object} state
	 * @return {Verdict}
	 */
	LevelsRules[Level.INTRO] = function(state) {
	  var fireballs = state.garbage.filter(function(object) {
	    return object.type === ObjectType.FIREBALL;
	  });
	
	  return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
	};
	
	/**
	 * Начальные условия для уровней.
	 * @enum {Object.<Level, function>}
	 */
	var LevelsInitialize = {};
	
	/**
	 * Первый уровень.
	 * @param {Object} state
	 * @return {Object}
	 */
	LevelsInitialize[Level.INTRO] = function(state) {
	  state.objects.push(
	    // Установка персонажа в начальное положение. Он стоит в крайнем левом
	    // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
	    // уровне равна 2px за кадр.
	    {
	      direction: Direction.RIGHT,
	      height: 84,
	      speed: 2,
	      sprite: 'img/wizard.gif',
	      spriteReversed: 'img/wizard-reversed.gif',
	      state: ObjectState.OK,
	      type: ObjectType.ME,
	      width: 61,
	      x: WIDTH / 3,
	      y: HEIGHT - 100
	    }
	  );
	
	  return state;
	};
	
	/**
	  Переменные для эффекта параллакса
	*/
	var THROTTLE_TIMEOUT = 100;
	var INITIAL_CLOUDS_POSITION = '0px';
	var scrollTimeout;
	var clouds = document.querySelector('.header-clouds');
	clouds.style.backgroundPosition = INITIAL_CLOUDS_POSITION;
	var demo = document.querySelector('.demo');
	
	/**
	 * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
	 * и показывает приветственный экран.
	 * @param {Element} container
	 * @constructor
	 */
	var Game = function(container) {
	  this.container = container;
	  this.canvas = document.createElement('canvas');
	  this.canvas.width = container.clientWidth;
	  this.canvas.height = container.clientHeight;
	  this.container.appendChild(this.canvas);
	
	  this.ctx = this.canvas.getContext('2d');
	
	  this._onKeyDown = this._onKeyDown.bind(this);
	  this._onKeyUp = this._onKeyUp.bind(this);
	  this._pauseListener = this._pauseListener.bind(this);
	  this._onScroll = this._onScroll.bind(this);
	  this.setDeactivated(false);
	};
	
	Game.prototype = {
	  /**
	   * Текущий уровень игры.
	   * @type {Level}
	   */
	  level: INITIAL_LEVEL,
	
	  /** @param {boolean} deactivated */
	  setDeactivated: function(deactivated) {
	    if (this._deactivated === deactivated) {
	      return;
	    }
	
	    this._deactivated = deactivated;
	
	    if (deactivated) {
	      this._removeGameListeners();
	    } else {
	      this._initializeGameListeners();
	    }
	  },
	
	  /**
	   * Состояние игры. Описывает местоположение всех объектов на игровой карте
	   * и время проведенное на уровне и в игре.
	   * @return {Object}
	   */
	  getInitialState: function() {
	    return {
	      // Статус игры. Если CONTINUE, то игра продолжается.
	      currentStatus: Verdict.CONTINUE,
	
	      // Объекты, удаленные на последнем кадре.
	      garbage: [],
	
	      // Время с момента отрисовки предыдущего кадра.
	      lastUpdated: null,
	
	      // Состояние нажатых клавиш.
	      keysPressed: {
	        ESC: false,
	        LEFT: false,
	        RIGHT: false,
	        SPACE: false,
	        UP: false
	      },
	
	      // Время начала прохождения уровня.
	      levelStartTime: null,
	
	      // Все объекты на карте.
	      objects: [],
	
	      // Время начала прохождения игры.
	      startTime: null
	    };
	  },
	
	  /**
	   * Начальные проверки и запуск текущего уровня.
	   * @param {Level=} level
	   * @param {boolean=} restart
	   */
	  initializeLevelAndStart: function(level, restart) {
	    level = typeof level === 'undefined' ? this.level : level;
	    restart = typeof restart === 'undefined' ? true : restart;
	
	    if (restart || !this.state) {
	      // При перезапуске уровня, происходит полная перезапись состояния
	      // игры из изначального состояния.
	      this.state = this.getInitialState();
	      this.state = LevelsInitialize[this.level](this.state);
	    } else {
	      // При продолжении уровня состояние сохраняется, кроме записи о том,
	      // что состояние уровня изменилось с паузы на продолжение игры.
	      this.state.currentStatus = Verdict.CONTINUE;
	    }
	
	    // Запись времени начала игры и времени начала уровня.
	    this.state.levelStartTime = Date.now();
	    if (!this.state.startTime) {
	      this.state.startTime = this.state.levelStartTime;
	    }
	
	    this._preloadImagesForLevel(function() {
	      // Предварительная отрисовка игрового экрана.
	      this.render();
	
	      // Установка обработчиков событий.
	      this._initializeGameListeners();
	
	      // Запуск игрового цикла.
	      this.update();
	    }.bind(this));
	  },
	
	  /**
	   * Временная остановка игры.
	   * @param {Verdict=} verdict
	   */
	  pauseLevel: function(verdict) {
	    if (verdict) {
	      this.state.currentStatus = verdict;
	    }
	
	    this.state.keysPressed.ESC = false;
	    this.state.lastUpdated = null;
	
	    this._removeGameListeners();
	    window.addEventListener('keydown', this._pauseListener);
	
	    this._drawPauseScreen();
	  },
	
	  /**
	   * Обработчик событий клавиатуры во время паузы.
	   * @param {KeyboardsEvent} evt
	   * @private
	   * @private
	   */
	  _pauseListener: function(evt) {
	    if (evt.keyCode === 32 && !this._deactivated) {
	      evt.preventDefault();
	      var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
	          this.state.currentStatus === Verdict.FAIL;
	      this.initializeLevelAndStart(this.level, needToRestartTheGame);
	
	      window.removeEventListener('keydown', this._pauseListener);
	    }
	  },
	
	  /**
	   * Отрисовка экрана паузы.
	   */
	
	  _drawPauseScreen: function() {
	
	    function textWrap(ctx, text, x, y, maxWidth, lineHeight) {
	      var words = text.split(' ');
	      var line = '';
	      for (var i = 0; i < words.length; i++) {
	        var testLine = line + words[i] + ' ';
	        var testWidth = ctx.measureText(testLine).width;
	        if (testWidth > maxWidth) {
	          ctx.fillText(line, x, y);
	          line = words[i] + ' ';
	          y += lineHeight;
	        } else {
	          line = testLine;
	        }
	      }
	      ctx.fillText(line, x, y);
	    }
	
	    var ctx = this.ctx;
	    var textStartX = 340;
	    var textStartY = 70;
	    var lineHeight = 20;
	    var maxWidth = 250;
	    var text = ['Привет! Я перемещаюсь при нажатии на стрелки и пускаю фаербол клавишей шифт. Жми пробел, чтобы начать!', 'Ты выиграл! Сыграем еще?', 'Ты проиграл! Попробуй сначала', 'Пауза. Пробел для продолжения'];
	
	    ctx.beginPath();
	    ctx.moveTo(310, 210);
	    ctx.lineTo(330, 60);
	    ctx.lineTo(630, 60);
	    ctx.lineTo(630, 200);
	    ctx.closePath();
	    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	    ctx.fill();
	
	    ctx.beginPath();
	    ctx.moveTo(300, 200);
	    ctx.lineTo(320, 50);
	    ctx.lineTo(620, 50);
	    ctx.lineTo(620, 190);
	    ctx.closePath();
	    ctx.fillStyle = '#ffffff';
	    ctx.fill();
	
	    ctx.font = '16px PT Mono';
	    ctx.textBaseline = 'hanging';
	    ctx.fillStyle = '#000000';
	
	    switch (this.state.currentStatus) {
	      case Verdict.WIN:
	        textWrap(ctx, text[1], textStartX, textStartY, maxWidth, lineHeight);
	        break;
	      case Verdict.FAIL:
	        textWrap(ctx, text[2], textStartX, textStartY, maxWidth, lineHeight);
	        break;
	      case Verdict.PAUSE:
	        textWrap(ctx, text[3], textStartX, textStartY, maxWidth, lineHeight);
	        break;
	      case Verdict.INTRO:
	        textWrap(ctx, text[0], textStartX, textStartY, maxWidth, lineHeight);
	        break;
	    }
	  },
	
	  /**
	   * Предзагрузка необходимых изображений для уровня.
	   * @param {function} callback
	   * @private
	   */
	  _preloadImagesForLevel: function(callback) {
	    if (typeof this._imagesArePreloaded === 'undefined') {
	      this._imagesArePreloaded = [];
	    }
	
	    if (this._imagesArePreloaded[this.level]) {
	      callback();
	      return;
	    }
	
	    var levelImages = [];
	    this.state.objects.forEach(function(object) {
	      levelImages.push(object.sprite);
	
	      if (object.spriteReversed) {
	        levelImages.push(object.spriteReversed);
	      }
	    });
	
	    var i = levelImages.length;
	    var imagesToGo = levelImages.length;
	
	    while (i-- > 0) {
	      var image = new Image();
	      image.src = levelImages[i];
	      image.onload = function() {
	        if (--imagesToGo === 0) {
	          this._imagesArePreloaded[this.level] = true;
	          callback();
	        }
	      }.bind(this);
	    }
	  },
	
	  /**
	   * Обновление статуса объектов на экране. Добавляет объекты, которые должны
	   * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
	   * должны исчезнуть.
	   * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
	   */
	  updateObjects: function(delta) {
	    // Персонаж.
	    var me = this.state.objects.filter(function(object) {
	      return object.type === ObjectType.ME;
	    })[0];
	
	    // Добавляет на карту файрбол по нажатию на Shift.
	    if (this.state.keysPressed.SHIFT) {
	      this.state.objects.push({
	        direction: me.direction,
	        height: 24,
	        speed: 5,
	        sprite: 'img/fireball.gif',
	        type: ObjectType.FIREBALL,
	        width: 24,
	        x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
	        y: me.y + me.height / 2
	      });
	
	      this.state.keysPressed.SHIFT = false;
	    }
	
	    this.state.garbage = [];
	
	    // Убирает в garbage не используемые на карте объекты.
	    var remainingObjects = this.state.objects.filter(function(object) {
	      ObjectsBehaviour[object.type](object, this.state, delta);
	
	      if (object.state === ObjectState.DISPOSED) {
	        this.state.garbage.push(object);
	        return false;
	      }
	
	      return true;
	    }, this);
	
	    this.state.objects = remainingObjects;
	  },
	
	  /**
	   * Проверка статуса текущего уровня.
	   */
	  checkStatus: function() {
	    // Нет нужны запускать проверку, нужно ли останавливать уровень, если
	    // заранее известно, что да.
	    if (this.state.currentStatus !== Verdict.CONTINUE) {
	      return;
	    }
	
	    if (!this.commonRules) {
	      /**
	       * Проверки, не зависящие от уровня, но влияющие на его состояние.
	       * @type {Array.<functions(Object):Verdict>}
	       */
	      this.commonRules = [
	        /**
	         * Если персонаж мертв, игра прекращается.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkDeath(state) {
	          var me = state.objects.filter(function(object) {
	            return object.type === ObjectType.ME;
	          })[0];
	
	          return me.state === ObjectState.DISPOSED ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	        },
	
	        /**
	         * Если нажата клавиша Esc игра ставится на паузу.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkKeys(state) {
	          return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
	        },
	
	        /**
	         * Игра прекращается если игрок продолжает играть в нее два часа подряд.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkTime(state) {
	          return Date.now() - state.startTime > 3 * 60 * 1000 ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	        }
	      ];
	    }
	
	    // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
	    // по всем универсальным проверкам и проверкам конкретного уровня.
	    // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
	    // любое другое состояние кроме CONTINUE или пока не пройдут все
	    // проверки. После этого состояние сохраняется.
	    var allChecks = this.commonRules.concat(LevelsRules[this.level]);
	    var currentCheck = Verdict.CONTINUE;
	    var currentRule;
	
	    while (currentCheck === Verdict.CONTINUE && allChecks.length) {
	      currentRule = allChecks.shift();
	      currentCheck = currentRule(this.state);
	    }
	
	    this.state.currentStatus = currentCheck;
	  },
	
	  /**
	   * Принудительная установка состояния игры. Используется для изменения
	   * состояния игры от внешних условий, например, когда необходимо остановить
	   * игру, если она находится вне области видимости и установить вводный
	   * экран.
	   * @param {Verdict} status
	   */
	  setGameStatus: function(status) {
	    if (this.state.currentStatus !== status) {
	      this.state.currentStatus = status;
	    }
	  },
	
	  /**
	   * Отрисовка всех объектов на экране.
	   */
	  render: function() {
	    // Удаление всех отрисованных на странице элементов.
	    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	    // Выставление всех элементов, оставшихся в this.state.objects согласно
	    // их координатам и направлению.
	    this.state.objects.forEach(function(object) {
	      if (object.sprite) {
	        var image = new Image(object.width, object.height);
	        image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
	            object.spriteReversed :
	            object.sprite;
	        this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
	      }
	    }, this);
	  },
	
	  /**
	   * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
	   * и обновляет их согласно правилам их поведения, а затем запускает
	   * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
	   * проверка не вернет состояние FAIL, WIN или PAUSE.
	   */
	  update: function() {
	    if (!this.state.lastUpdated) {
	      this.state.lastUpdated = Date.now();
	    }
	
	    var delta = (Date.now() - this.state.lastUpdated) / 10;
	    this.updateObjects(delta);
	    this.checkStatus();
	
	    switch (this.state.currentStatus) {
	      case Verdict.CONTINUE:
	        this.state.lastUpdated = Date.now();
	        this.render();
	        requestAnimationFrame(function() {
	          this.update();
	        }.bind(this));
	        break;
	
	      case Verdict.WIN:
	      case Verdict.FAIL:
	      case Verdict.PAUSE:
	      case Verdict.INTRO:
	        this.pauseLevel();
	        break;
	    }
	  },
	
	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyDown: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = true;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = true;
	        break;
	      case 38:
	        this.state.keysPressed.UP = true;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = true;
	        break;
	    }
	
	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = true;
	    }
	  },
	
	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyUp: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = false;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = false;
	        break;
	      case 38:
	        this.state.keysPressed.UP = false;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = false;
	        break;
	    }
	
	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = false;
	    }
	  },
	
	  _onScroll: function() {
	    var self = this;
	    clearTimeout(scrollTimeout);
	    scrollTimeout = setTimeout(function() {
	      if(demo.getBoundingClientRect().bottom < 0) {
	        self.setGameStatus(Game.Verdict.PAUSE);
	      }
	    }, THROTTLE_TIMEOUT);
	
	    var scrolled = window.pageYOffset;
	    clouds.style.backgroundPosition = -(scrolled / 4) + 'px';
	  },
	
	  /** @private */
	  _initializeGameListeners: function() {
	    window.addEventListener('keydown', this._onKeyDown);
	    window.addEventListener('keyup', this._onKeyUp);
	    window.addEventListener('scroll', this._onScroll);
	  },
	
	  /** @private */
	  _removeGameListeners: function() {
	    window.removeEventListener('keydown', this._onKeyDown);
	    window.removeEventListener('keyup', this._onKeyUp);
	  }
	};
	
	Game.Verdict = Verdict;
	
	module.exports = Game;


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var activePicture = 0;
	
	var Gallery = function(pictures) {
	  this.pictures = pictures;
	  this.galleryContainer = document.querySelector('.overlay-gallery');
	  this.galleryImgContainer = document.querySelector('.overlay-gallery-preview');
	  this.galleryPrevious = document.querySelector('.overlay-gallery-control-left');
	  this.galleryNext = document.querySelector('.overlay-gallery-control-right');
	  this.galleryCurrent = document.querySelector('.preview-number-current');
	  this.galleryTotal = document.querySelector('.preview-number-total');
	  this.galleryClose = document.querySelector('.overlay-gallery-close');
	  this.activePicture = activePicture;
	  this.onGalleryClose = this.onGalleryClose.bind(this);
	  this.onGalleryNext = this.onGalleryNext.bind(this);
	  this.onGalleryPrevious = this.onGalleryPrevious.bind(this);
	};
	
	Gallery.prototype.onGalleryClose = function() {
	  this.hide();
	};
	
	Gallery.prototype.onGalleryNext = function() {
	  var limitMax = this.pictures.length - 1;
	  if(this.activePicture >= limitMax) {
	    this.activePicture = limitMax;
	  } else {
	    this.setActivePicture(this.activePicture + 1);
	  }
	};
	
	Gallery.prototype.onGalleryPrevious = function() {
	  var limitMin = 0;
	  if(this.activePicture <= limitMin) {
	    this.activePicture = limitMin;
	  } else {
	    this.setActivePicture(this.activePicture - 1);
	  }
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


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map