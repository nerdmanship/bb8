"use strict";

var project = function project() {
  var rollingRight = false,
      tl,
      svg = document.querySelector("[data-bb8=svg]"),
      gravel = svg.querySelectorAll("[data-bb8=gravel]"),
      animElems = ["bb8", "unit", "bodySurface", "rotatingHead", "headShadowBig", "headShadowSmall", "bouncingHead", "antennaLong", "antennaShort", "headSurface", "littleEye", "bigEye", "pupil1", "pupil2", "pupil3", "pupil4"],
      bb8 = {};

  for (var i = 0; i < animElems.length; i++) {
    bb8[animElems[i]] = svg.querySelector("[data-bb8=" + animElems[i] + "]");
  }

  var headSpinElems = [bb8.headSurface, bb8.bigEye, bb8.littleEye];

  function createTimeline() {
    tl = new TimelineMax({ paused: true });
    tl.to(bb8.bb8, 1, { y: "+=250", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.bb8, 1, { scale: 1.2, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.bb8, 2, { x: "-=150", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.unit, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.bouncingHead, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0.02).to(bb8.bodySurface, 0.5, { rotation: -360, transformOrigin: "center", ease: Linear.easeNone, repeat: -1 }, 0).to(bb8.rotatingHead, 1, { rotation: -10, transformOrigin: "center", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.bodySurface, 1, { y: "+=200", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.bodySurface, 2, { x: "+=100", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(headSpinElems, 0.5, { x: "-=100", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to([bb8.bigEye, bb8.littleEye], 0.5, { x: "-=110", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.antennaShort, 0.5, { x: "+=80", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(bb8.antennaLong, 0.5, { x: "+=50", ease: Power1.easeInOut, repeat: -1, yoyo: true }, 0).to(gravel, 0.75, { x: "+=4000", ease: Linear.easeNone, repeat: -1 }, 0);
  }
  function roll() {
    if (rollingRight) {
      TweenMax.to(tl, 1, { timeScale: 1 });
    } else {
      tl.play().timeScale(0);
      TweenMax.to(tl, 1, { timeScale: 1, ease: Power4.easeIn });
    }
  }

  createTimeline();
  roll();
};

project();
