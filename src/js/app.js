var project = function() {
  var rollingRight = true,
  tlRoll,
  svg = document.querySelector("[data-bb8=svg]"),
  gravel = svg.querySelectorAll("[data-bb8=gravel]"),
  animElems = ["bb8","unit","bodySurface","rotatingHead","headShadowBig","headShadowSmall","bouncingHead","antennaLong","antennaShort","headSurface","littleEye","bigEye","pupil1","pupil2","pupil3","pupil4"],
  bb8 = {};

  for (var i = 0; i < animElems.length; i++) {
    bb8[animElems[i]] = svg.querySelector("[data-bb8=" + animElems[i] + "]");
  }

  var headSpinElems = [bb8.headSurface, bb8.bigEye, bb8.littleEye];

  function buildTimeline() {
    tlRoll = new TimelineMax({ });
    tlRoll
    .to(bb8.bb8, 1, { y: "+=250", ease: Power1.easeInOut, repeat: 1000, yoyo:true }, 0)
    .to(bb8.bb8, 1, { scale: 1.2, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: 1000, yoyo:true }, 0)
    .to(bb8.bb8, 2, { x: "-=150", ease: Power1.easeInOut, repeat: 500, yoyo:true }, 0)
    .to(bb8.unit, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo:true }, 0)
    .to(bb8.bouncingHead, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo:true }, 0.02)
    .to(bb8.bodySurface, 0.5, { rotation: -360, transformOrigin: "center", ease: Linear.easeNone, repeat: 2000 }, 0)
    .to(bb8.bodySurface, 1, { y: "+=200", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 0)
    .to(bb8.bodySurface, 2, { x: "+=100", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 0)
    .to(gravel, 0.75, { x: "+=4000", ease: Linear.easeNone, repeat: 1500 }, 0);
  }
  function changeDir() {
    if(rollingRight) {
      TweenMax.to(tlRoll, 1, {timeScale: 1, ease: Power4.easeIn });
      rollingRight = false;
    } else {
      TweenMax.to(tlRoll, 1, {timeScale: 0});
      tlRoll.reverse();
      TweenMax.to(tlRoll, 1, {timeScale: 1});
      rollingRight = true;
    }
  }
  
  buildTimeline();
  tlRoll.progress(0.5).timeScale(0);
  changeDir();
  return changeDir;
};

project();
/*

  .to(headSpinElems, 0.5, { x: "-=100", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0)
  .to(bb8.rotatingHead, 1, { rotation: -10, transformOrigin: "center", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0)
  .to([bb8.bigEye, bb8.littleEye], 0.5, { x: "-=110", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0)
  .to(bb8.antennaShort, 0.5, { x: "+=80", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0)
  .to(bb8.antennaLong, 0.5, { x: "+=50", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0)

*/

/*

var container = $("#container"),
    tl;

function getAnimation() {
  var tween = new TweenMax(element, 1, { x: "+=3000", ease:Linear.easeNone });
  return tween;
}

//create a bunch of Bezier tweens and add them to a timeline
function buildTimeline() {
  tl = new TimelineMax({repeat:300});

  for (i = 0 ; i < gravel.length; i++){
    tl.add(getAnimation(), i * 0.17);
  }
}

buildTimeline();
tl.progress(0.5).timeScale(0);

*/