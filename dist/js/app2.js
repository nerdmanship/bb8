"use strict";

// This is what is happening

// Little bb8 peeks into the circle
// Flirt with the user and pops back out
// Scene starts rolling and bb8 comes into center
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

var bb8Module = {

    isFirstScene: true,
    isFirstStop: true,
    isRollingLeft: true,
    headNull: {
        value: 1
    },
    init: function init() {
        this.cacheDOM();
        this.bindEvents();
        this.setStart();
        this.createTimelines();
        this.defineTimelines();
        this.animate();
    },
    cacheDOM: function cacheDOM() {
        this.svg = document.querySelector("[data-bb8=svg]");
        this.gravel = this.svg.querySelectorAll("[data-bb8=gravel]");
        this.largeMask = this.svg.querySelector("[data-bb8=largeMask]");
        this.animElems = ["bb8", "unit", "bodySurface", "rotatingHead", "headShadowBig", "headShadowSmall", "bouncingHead", "antennaLong", "antennaShort", "headSurface", "littleEye", "bigEye", "pupil1", "pupil2", "pupil3", "pupil4"];
        this.bb8 = {};
        for (var i = 0; i < this.animElems.length; i++) {
            this.bb8[this.animElems[i]] = this.svg.querySelector("[data-bb8=" + this.animElems[i] + "]");
        }
    },
    bindEvents: function bindEvents() {
        this.bb8.bb8.addEventListener("mouseup", this.animate.bind(this));
    },
    setStart: function setStart() {
        TweenMax.set(this.largeMask, { scale: 0, transformOrigin: "center" });
        TweenMax.set(this.bb8.bb8, { y: 3500, x: 2900, scale: 2.5, transformOrigin: "center bottom" });
        TweenMax.set(this.bb8.rotatingHead, { rotation: 20, transformOrigin: "center" });
    },
    createTimelines: function createTimelines() {
        this.timelines = ["intro", "roll", "left", "right"];
        this.tl = {};
        for (var i = 0; i < this.timelines.length; i++) {
            this.tl[this.timelines[i]] = new TimelineMax({ paused: true });
        }
    },
    defineTimelines: function defineTimelines() {
        // INTRO
        this.tl.intro.add("isFirstScene").to(this.largeMask, 1.5, { scale: 0.95, ease: Back.easeInOut.config(1) }).add("bb8-in").to(this.bb8.bb8, 5.5, { x: 2000, y: 4300, scale: 3, ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.bodySurface, 5.5, { rotation: -30, transformOrigin: "center", ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.rotatingHead, 0.1, { rotation: -20, transformOrigin: "center", ease: Elastic.easeInOut.config(1) }, "bb8-in =+0.3").to(this.bb8.rotatingHead, 5.1, { rotation: -15, transformOrigin: "center", ease: Elastic.easeOut.config(2) }, "bb8-in =+0.4").to(this.bb8.bouncingHead, 0.2, { y: "-=10", ease: Power3.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.4 }, "bb8-in =+2").to(this.bb8.bouncingHead, 0.35, { y: "+=15", ease: Power1.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.2 }, "bb8-in =+3.4").to(this.bb8.bouncingHead, 0.275, { y: "-=5", repeat: 1, yoyo: true, repeatDelay: 0.1, ease: Power4.easeInOut }, "bb8-in =+4.85").add("bb8-flirt")
        // Staggering eye
        // ...
        // Rotating head
        // ...
        // Spinning head
        // ...

        .add("bb8-out").to(this.bb8.bb8, 1, { x: 4500, ease: Back.easeIn.config(2) }, "bb8-out").to(this.bb8.bodySurface, 1, { rotation: 30, ease: Back.easeIn.config(2) }, "bb8-out").add("startRolling").add(bb8Module.spinHead, "startRolling").set(this.bb8.bb8, { y: 400, scale: 1, transformOrigin: "center bottom" }, "startRolling").to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, "startRolling")
        // Moving X/Y
        .to(this.bb8.bb8, 2, { x: "-=150", ease: Power1.easeInOut, repeat: 500, yoyo: true }, "startRolling =+3").to(this.bb8.bb8, 1, { y: "+=300", scale: 1.18, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, "startRolling").to(this.bb8.bodySurface, 1, { y: "+=200", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, "startRolling").to(this.bb8.bodySurface, 2, { x: "+=100", ease: Power1.easeInOut, repeat: 500, yoyo: true }, "startRolling")
        // Rolling
        .to(this.bb8.bodySurface, 1, { rotation: "-=360", ease: Linear.easeNone, repeat: 100 }, "startRolling")
        // Bouncing
        .to(this.bb8.unit, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, "startRolling").to(this.bb8.bouncingHead, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, "startRolling")
        // Rotating head
        // ...
        // Spinning head
        .to(this.headNull, 1, { value: -1, ease: Linear.easeNone, repeat: 500, yoyo: true }, "startRolling");

        // ROLLING
        this.tl.left.to(this.bb8.bodySurface, 0.5, { rotation: "-=360", transformOrigin: "center", ease: Linear.easeNone, repeat: 500 });
        // Get current rotation value
        // Make fromTo from current to 360

        this.tl.right.to(this.bb8.bodySurface, 0.5, { rotation: "+=360", transformOrigin: "center", ease: Linear.easeNone, repeat: 500 });
    },
    animate: function animate() {
        console.log("Animating");
        if (this.isFirstScene) {
            this.isFirstScene = false;
            console.log("Doing intro scene");
            this.intro();
        } else if (bb8Module.isRollingLeft) {
            console.log("Starting roll right sequence");
            bb8Module.stopAnd(bb8Module.rollRight);
        } else {
            console.log("Starting roll left sequence");
            bb8Module.stopAnd(bb8Module.rollLeft);
        }
    },
    intro: function intro() {
        this.tl.intro.play();
    },
    rollLeft: function rollLeft() {
        console.log("Starting to roll left");
        bb8Module.tl.left.resume().timeScale(0);
        TweenMax.to(bb8Module.tl.left, 1, { timeScale: 1 });
    },
    rollRight: function rollRight() {
        console.log("Starting to roll right");
        bb8Module.tl.intro.kill();
        bb8Module.tl.right.play().timeScale(0);
        TweenMax.to(bb8Module.tl.right, 1, { timeScale: 1 });
    },
    stopAnd: function stopAnd(nextTl) {
        if (bb8Module.isFirstStop) {
            bb8Module.isFirstStop = false;
            bb8Module.isRollingLeft = false;
            console.log("Stopping intro");
            TweenMax.to(bb8Module.tl.intro, 1, { timeScale: 0, onComplete: nextTl });
        } else if (bb8Module.isRollingLeft) {
            bb8Module.isRollingLeft = false;
            console.log("Stopping left roll");
            TweenMax.to(this.tl.left, 1, { timeScale: 0, onComplete: nextTl });
        } else {
            bb8Module.isRollingLeft = true;
            console.log("Stopping right roll");
            TweenMax.to(this.tl.right, 1, { timeScale: 0, onComplete: nextTl });
        }
    },
    random: function random(min, max) {
        if (max === null) {
            max = min;min = 0;
        }
        return Math.random() * (max - min) + min;
    },
    spinHead: function spinHead() {
        var val = bb8Module.headNull.value;
        TweenMax.set(bb8Module.bb8.headSurface, { x: val * 120 });
        TweenMax.set(bb8Module.bb8.bigEye, { x: val * 127 });
        TweenMax.set(bb8Module.bb8.littleEye, { x: val * 125 });
        TweenMax.set(bb8Module.bb8.antennaShort, { x: -val * 150 });
        TweenMax.set(bb8Module.bb8.antennaLong, { x: -val * 100 });
        // centerVal +/- null * range
        window.requestAnimFrame(bb8Module.spinHead);
    },
    tester: function tester() {
        console.log("");
        window.requestAnimFrame(bb8Module.tester);
    }
};
//window.requestAnimFrame(bb8Module.tester);  
bb8Module.init();
