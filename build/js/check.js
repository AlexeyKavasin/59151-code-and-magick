function getMessage (a, b) {
  if(typeof(a) === "boolean"){
    if (a === true) {
      return "Я попал в " + b;
    } else {
      return "Я никуда не попал";
    }
  }

  if (typeof(a) === 'number') {
    return "Я прыгнул на " + (a * 100) + " сантиметров";
  }

  if (a instanceof Array && b instanceof Array) {
    var distancePath = 0;
    for (var i = 0; i < a.length; i++) {
      distancePath += a[i] * b[i];
    }
    return "Я прошёл " + distancePath + " метров";
  }

  if (a instanceof Array) {
    var numberOfSteps = 0;
    for (var i = 0; i < a.length; i++) {
      numberOfSteps += a[i];
    }
    return "Я прошёл " + numberOfSteps + " шагов";
  }
}
