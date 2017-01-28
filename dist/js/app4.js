"use strict";

// Fix the gravel

function random(min, max) {
    if (max === null) {
        max = min;min = 0;
    }
    return Math.random() * (max - min) + min;
}

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

var o = {
    isIntro: true,
    isRollingLeft: false,
    currentTl: [],
    currentGravelTl: [],
    gravelProgress: [],
    prevGravelProgress: [],

    headNull: {
        value: 1
    },

    init: function init() {
        this.cacheDOM();
        this.bindEvents();
        this.setStart();
        this.animate();
    },
    cacheDOM: function cacheDOM() {
        this.svg = document.querySelector("[data-bb8=svg]");
        this.gravelGroup = this.svg.querySelector("[data-bb8=gravelGroup]");
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
        this.bb8.bb8.addEventListener("mouseover", this.slowMoOn.bind(this));
        this.bb8.bb8.addEventListener("mouseout", this.slowMoOff.bind(this));
    },
    setStart: function setStart() {
        TweenMax.set(this.svg, { autoAlpha: 1 });
        TweenMax.set(this.largeMask, { scale: 0, transformOrigin: "center" });
        TweenMax.set(this.bb8.bb8, { y: 3500, x: 2900, scale: 2.5, transformOrigin: "center bottom" });
        TweenMax.set(this.bb8.rotatingHead, { rotation: 20, transformOrigin: "center" });
        o.spreadGravel();
    },
    spreadGravel: function spreadGravel() {
        TweenMax.set(o.gravelGroup, { x: -50 });

        for (var i = 0; i < o.gravel.length; i++) {
            TweenMax.set(o.gravel[i], { x: 0, y: random(100, 800) });
        }
        o.getGravelAnims("right");
    },
    getRollAnims: function getRollAnims(direction) {
        var tls = o.getGravelAnims(direction);

        // Inventory values separated by rolling direction
        var spinDir;

        if (direction === "left") {
            spinDir = "-=360";
        } else {
            spinDir = "+=360";
        }
        var tl = new TimelineMax();

        // Define multi directional roll animation here
        tl
        // Repeating roll - tot 500s
        .to(this.bb8.bodySurface, 0.5, { rotation: spinDir, transformOrigin: "center", ease: Linear.easeNone, repeat: 1000 }, 0)

        // Correct positions
        .to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, 0).to(this.bb8.bb8, 1, { y: 700, scale: 1.18, transformOrigin: "center bottom", ease: Power1.easeInOut }, 0).to(this.bb8.bodySurface, 1, { y: -400, ease: Power1.easeInOut }, 0).to(this.bb8.bodySurface, 2, { x: -600, ease: Power1.easeInOut }, 0).to(this.bb8.unit, 0.05, { y: 0, ease: Power1.easeInOut }, 0).to(this.bb8.bouncingHead, 0.05, { y: 0, ease: Power1.easeInOut }, 0)

        // Repeating values

        // Moving X/Y
        .to(this.bb8.bb8, 5, { x: "-=300", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2).to(this.bb8.bb8, 2, { y: "-=400", scale: 1, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 1).to(this.bb8.bodySurface, 2, { y: "-=350", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 1).to(this.bb8.bodySurface, 5, { x: "+=200", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2)

        // Bouncing
        .to(this.bb8.unit, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, 0.05).to(this.bb8.bouncingHead, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, 0.05)

        // Rotating head
        // ...

        // Spinning head
        .to(this.headNull, 1, { value: -1, ease: Linear.easeNone, repeat: 500, yoyo: true }, 0);

        tls[tls.length] = tl;
        return tls;
    },
    getIntroAnim: function getIntroAnim() {
        var tl = new TimelineMax();

        tl.add("").to(this.largeMask, 1.5, { scale: 0.95, ease: Back.easeInOut.config(1) }).add("bb8-in").to(this.bb8.bb8, 5.5, { x: 2000, y: 4300, scale: 3, ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.bodySurface, 5.5, { rotation: -30, transformOrigin: "center", ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.rotatingHead, 0.1, { rotation: -20, transformOrigin: "center", ease: Elastic.easeInOut.config(1) }, "bb8-in =+0.3").to(this.bb8.rotatingHead, 5.1, { rotation: -15, transformOrigin: "center", ease: Elastic.easeOut.config(2) }, "bb8-in =+0.4").to(this.bb8.bouncingHead, 0.2, { y: "-=10", ease: Power3.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.4 }, "bb8-in =+2").to(this.bb8.bouncingHead, 0.35, { y: "+=15", ease: Power1.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.2 }, "bb8-in =+3.4").to(this.bb8.bouncingHead, 0.275, { y: "-=5", repeat: 1, yoyo: true, repeatDelay: 0.1, ease: Power4.easeInOut }, "bb8-in =+4.85").add("bb8-flirt")
        // Staggering eye
        // ...
        // Rotating head
        // ...
        // Spinning head
        // ...

        .add("bb8-out").to(this.bb8.bb8, 1, { x: 4500, ease: Back.easeIn.config(2) }, "bb8-out").to(this.bb8.bodySurface, 1, { rotation: 30, ease: Back.easeIn.config(2) }, "bb8-out").set(this.bb8.bb8, { y: 600, scale: 1, transformOrigin: "center bottom" }).add(o.animate)
        // .add("startRolling")
        // .add(o.spinHead, "startRolling")
        // .to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, "startRolling")
        ;
        return tl;
    },
    getGravelAnims: function getGravelAnims(direction) {
        // Make an array for timelines
        var tls = [];

        // Iterate thru gravel array, create unique timelines for each and add them to timelines array
        for (var i = 0; i < o.gravel.length; i++) {
            // Values for all timelines all times
            var speed = 0.5;
            var fromX = direction === "left" ? 0 : 2935;
            var toX = direction === "left" ? 2935 : 0;

            // Generate seamless progress values
            if (o.prevGravelProgress.length != o.gravel.length) {
                // If prev array not full of values, then give each gravel a randomize progress value
                o.gravelProgress[i] = random(0, 1);
                // ...and push it into the prev array
                o.prevGravelProgress[i] = o.gravelProgress[i];
            } else {
                // If prev array is full of values, then inverse each value
                o.gravelProgress[i] = 1 - o.prevGravelProgress[i];
            }

            // Create an individual timeline
            var tl = new TimelineMax({ repeat: 100 });

            // Define the tween and set the playhead at correct progress
            tl.fromTo(o.gravel[i], speed, { x: fromX }, { x: toX, ease: Linear.easeNone }).progress(o.gravelProgress[i]).paused(true);

            // Add the timeline to the array
            tls[i] = tl;
        }
        // Spit out the array
        return tls;
    },
    // createGravelTimelines: function(direction) {
    //     // Create paused gravel timelines
    //     for (var i = 0 ; i < o.gravel.length; i++) {
    //         o.currentGravelTl[i] = o.getGravelAnim(direction, i);
    //     }
    // },
    animate: function animate() {
        if (this.isIntro) {
            o.playIntro();
        } else {
            o.stopPlayNext();
        }
    },
    playIntro: function playIntro() {
        o.isIntro = false;
        o.currentTl[0] = o.getIntroAnim();
        o.currentTl[0].play();
    },

    stopPlayNext: function stopPlayNext() {
        var direction;
        if (o.isRollingLeft) {
            o.isRollingLeft = false;
            direction = "right";
        } else {
            o.isRollingLeft = true;
            direction = "left";
        }

        TweenMax.to(o.currentTl, 0.5, { timeScale: 0, onComplete: o.roll, onCompleteParams: [direction] });
    },

    roll: function roll(direction) {

        // Record the progress value where each gravel stopped
        if (o.currentTl.length != 1) {
            o.recordProgress();
        }

        var tls = o.getRollAnims(direction);

        for (var i = 0; i < o.currentTl.length; i++) {
            o.currentTl[i].kill();
        }

        for (var j = 0; j < tls.length; j++) {

            o.currentTl[j] = tls[j];

            o.currentTl[j].play().timeScale(0);

            TweenMax.to(o.currentTl[j], 1, { timeScale: 1 });
        }
    },
    recordProgress: function recordProgress() {
        for (var i = 0; i < o.gravel.length; i++) {
            o.prevGravelProgress[i] = o.currentTl[i].progress();
        }
    },
    slowMoOn: function slowMoOn() {
        for (var i = 0; i < o.currentTl.length; i++) {
            TweenMax.to(o.currentTl[i], 0.1, { timeScale: 0.05 });
        }
    },
    slowMoOff: function slowMoOff() {
        for (var i = 0; i < o.currentTl.length; i++) {
            TweenMax.to(o.currentTl[i], 0.1, { timeScale: 1 });
        }
    },
    spinHead: function spinHead() {
        var val = o.headNull.value;
        TweenMax.set(o.bb8.headSurface, { x: val * 120 });
        TweenMax.set(o.bb8.bigEye, { x: val * 127 });
        TweenMax.set(o.bb8.littleEye, { x: val * 125 });
        TweenMax.set(o.bb8.antennaShort, { x: -val * 150 });
        TweenMax.set(o.bb8.antennaLong, { x: -val * 100 });
        // centerVal +/- null * range
        window.requestAnimFrame(o.spinHead);
    }
};

o.init();
