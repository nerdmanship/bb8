"use strict";

// Reference: https://youtu.be/_RWWKFqv7EM?t=1m53s

function random(min, max) {
    if (max === null) {
        max = min;min = 0;
    }
    return Math.random() * (max - min) + min;
}

function chanceRoll(chance) {
    if (chance === null) {
        chance = 50;
    }
    return chance > 0 && Math.random() * 100 <= chance;
}

var o = {
    // Timeline related
    isIntro: true,
    isRollingLeft: false,
    currentTl: [],
    currentGravelTl: [],
    gravelProgress: [],
    prevGravelProgress: [],
    // SlowMotion
    slowMoFactor: 1,
    slowMoFactorBody: 1,
    // Head light status on/off
    lightsOnOff: [0, 0],
    // Wiggle head
    wiggleFrame: 0,
    allTheTime: 0,
    nowAndThen: 0,
    ranDur: 0,
    ranPos: 0,
    moveAmount: 0,
    // Null object to parallax head components
    headNull: { value: 0 },

    init: function init() {
        this.cacheDOM();
        this.setStart();
        this.startTicker();
        this.animate();
    },
    cacheDOM: function cacheDOM() {
        this.svg = document.querySelector("[data-bb8=svg]");
        this.gravelGroup = this.svg.querySelector("[data-bb8=gravelGroup]");
        this.gravel = this.svg.querySelectorAll("[data-bb8=gravel]");
        this.largeMask = this.svg.querySelector("[data-bb8=largeMask]");
        this.animElems = ["bb8", "unit", "bodyShadow", "bodySurface", "rotatingHead", "headShadowBig", "headShadowSmall", "bouncingHead", "antennaLong", "antennaShort", "headSurface", "upperLight", "lowerLight", "littleEye", "bigEye", "eyeHighlight", "pupilGroup", "pupil1", "pupil2", "pupil3", "pupil4"];
        this.bb8 = {};
        for (var i = 0; i < this.animElems.length; i++) {
            this.bb8[this.animElems[i]] = this.svg.querySelector("[data-bb8=" + this.animElems[i] + "]");
        }
    },
    bindEvents: function bindEvents() {
        //this.bb8.bb8.addEventListener("mouseup", this.animate.bind(this));
        this.bb8.bb8.addEventListener("mouseover", function () {
            o.slowMotion(1);
        });
        this.bb8.bb8.addEventListener("mouseout", function () {
            o.slowMotion(0);
        });
    },
    setStart: function setStart() {
        TweenMax.set(this.svg, { autoAlpha: 1 });
        TweenMax.set(this.largeMask, { scale: 0, transformOrigin: "center" });
        TweenMax.set(this.bb8.bb8, { y: 3500, x: 2900, scale: 2.5, transformOrigin: "center bottom" });
        TweenMax.set(this.bb8.rotatingHead, { rotation: 20, transformOrigin: "center" });
        o.spreadGravel();
    },
    startTicker: function startTicker() {
        TweenMax.ticker.addEventListener("tick", o.wiggleHead);
        TweenMax.ticker.addEventListener("tick", o.blinkLights);
        TweenMax.ticker.addEventListener("tick", o.connectHeadToNull);
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
        var spinDir;

        if (direction === "left") {
            spinDir = "-=360";
        } else {
            spinDir = "+=360";
        }
        var tl = new TimelineMax({});

        // Roll animation
        tl.to(this.bb8.bodySurface, 0.5, { rotation: spinDir, transformOrigin: "center", ease: Linear.easeNone, repeat: 1000 }, 0).to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, 0).to(this.bb8.bb8, 1, { y: 500, scale: 1.05, transformOrigin: "center bottom", ease: Power1.easeInOut }, 0).to(this.bb8.bodySurface, 1, { y: -400, ease: Power1.easeInOut }, 0).to(this.bb8.bodySurface, 2, { x: -600, ease: Power1.easeInOut }, 0).to(this.bb8.unit, 0.05, { y: 0, ease: Power1.easeInOut }, 0).to(this.bb8.bouncingHead, 0.05, { y: 0, ease: Power1.easeInOut }, 0).to(this.bb8.bodyShadow, 0.05, { scale: 1, transformOrigin: "center", ease: Power1.easeInOut }, 0).to(this.bb8.bb8, 5, { x: "-=300", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2).to(this.bb8.bb8, 0.5, { y: "-=100", scale: 1, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 1).to(this.bb8.bodySurface, 0.5, { y: "-=250", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 1).to(this.bb8.bodySurface, 5, { x: "+=200", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2).to(this.bb8.unit, 0.05, { y: "-=20", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, 0.05).to(this.bb8.bodyShadow, 0.05, { scale: 1.03, transformOrigin: "center", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, 0.05).to(this.bb8.bouncingHead, 0.05, { y: "-=30", ease: Power1.easeInOut, repeat: 20000, yoyo: true }, 0.08).to(this.bb8.rotatingHead, 10, { bezier: [{ rotation: -20 }, { rotation: 10 }, { rotation: 0 }], ease: Linear.easeNone, repeat: 100 }, 0);

        tls[tls.length] = tl;
        return tls;
    },
    getIntroAnim: function getIntroAnim() {
        var tl = new TimelineMax();

        tl.to(this.largeMask, 1.5, { scale: 0.95, ease: Back.easeInOut.config(1) }).add("bb8-in").to(this.bb8.bb8, 4.5, { x: 2000, y: 4300, scale: 3, ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.bodySurface, 4.5, { rotation: -30, transformOrigin: "center", ease: Elastic.easeOut.config(10) }, "bb8-in").to(this.bb8.rotatingHead, 0.1, { rotation: -20, transformOrigin: "center" }, "bb8-in =+0.3").to(this.bb8.rotatingHead, 0.1, { rotation: 20, transformOrigin: "center" }, "bb8-in =+1").to(this.bb8.rotatingHead, 3, { rotation: -15, transformOrigin: "center", ease: Elastic.easeOut.config(0.5) }, "bb8-in =+1.5").to(this.bb8.bouncingHead, 0.2, { y: "-=10", ease: Power3.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.4 }, "bb8-in =+1").to(this.bb8.bouncingHead, 0.35, { y: "+=15", ease: Power1.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.2 }, "bb8-in =+2.4").to(this.bb8.bouncingHead, 0.275, { y: "-=5", repeat: 1, yoyo: true, repeatDelay: 0.1, ease: Power4.easeInOut }, "bb8-in =+3.85").add("bb8-distress").staggerTo([this.bb8.pupil1, this.bb8.pupil2, this.bb8.pupil3, this.bb8.pupil4], 0.2, { scale: 1.5, transformOrigin: "center", repeat: 3, yoyo: true }, 0.1, "bb8-in =+2.5").add("bb8-out").to(this.bb8.bb8, 1, { x: 4500, ease: Back.easeIn.config(2) }, "bb8-out").to(this.bb8.bodySurface, 1, { rotation: 30, ease: Back.easeIn.config(2) }, "bb8-out").to(this.bb8.rotatingHead, 1.2, { rotation: -30, transformOrigin: "center", ease: Back.easeInOut.config(2) }, "bb8-out").set(this.bb8.bb8, { y: 600, scale: 1, transformOrigin: "center bottom" }).set(this.bb8.rotatingHead, { rotation: 0, transformOrigin: "center" }).add(o.animate);
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
            var tl = new TimelineMax({ repeat: 2000 });

            // Define the tween and set the playhead at correct progress
            tl.fromTo(o.gravel[i], speed, { x: fromX }, { x: toX, ease: Linear.easeNone }).progress(o.gravelProgress[i]).paused(true);

            // Add the timeline to the array
            tls[i] = tl;
        }
        // Spit out the array
        return tls;
    },
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

        TweenMax.to(o.currentTl, 0.5 / o.slowMoFactor, { timeScale: 0, onComplete: o.roll, onCompleteParams: [direction] });
    },
    roll: function roll(direction) {

        if (o.currentTl.length === 1) {
            // Make art interactive first time roll is called
            o.bindEvents();
        } else {
            // Record progress of gravel timelines, except first time roll is called
            o.recordProgress();
        }

        // Record the progress value where each gravel stopped
        var tls = o.getRollAnims(direction);

        for (var i = 0; i < o.currentTl.length; i++) {
            o.currentTl[i].kill();
        }

        for (var j = 0; j < tls.length; j++) {

            o.currentTl[j] = tls[j];

            o.currentTl[j].play().timeScale(0);

            TweenMax.to(o.currentTl[j], 1 / o.slowMoFactor, { timeScale: o.slowMoFactorBody });
        }
    },
    recordProgress: function recordProgress() {
        for (var i = 0; i < o.gravel.length; i++) {
            o.prevGravelProgress[i] = o.currentTl[i].progress();
        }
    },
    slowMotion: function slowMotion(val) {
        if (val === 1) {
            o.slowMoFactor = 0.1;
            o.slowMoFactorBody = 0.05;
        } else {
            o.wiggleFrame = 0;
            o.allTheTime = 0;
            o.slowMoFactor = 1;
            o.slowMoFactorBody = 1;
        }

        for (var i = 0; i < o.currentTl.length; i++) {
            TweenMax.to(o.currentTl[i], 0.1, { timeScale: o.slowMoFactorBody });
        }
    },
    connectHeadToNull: function connectHeadToNull() {
        if (!val) {
            var val, headSurfacePos, bigEyePos, littleEyePos, antennaShortPos, antennaLongPos, pupilGroupPos, eyeHighlightPos;
            var headSurfaceCenter = -50;
            var bigEyeCenter = 217 + headSurfaceCenter;
            var littleEyeCenter = 385 + headSurfaceCenter;
            var antennaShortCenter = -50;
            var antennaLongCenter = -50;
            var pupilGroupCenter = 20;
            var eyeHighlightCenter = 10;
        }
        // Update value
        val = o.headNull.value;

        // null value (+/-1) * range/2
        headSurfacePos = val * 150;
        bigEyePos = val * 150;
        pupilGroupPos = val * 20;
        eyeHighlightPos = val * 10;
        littleEyePos = val * 150;
        antennaShortPos = -val * 120;
        antennaLongPos = -val * 70;

        TweenMax.set(o.bb8.headSurface, { x: headSurfaceCenter + headSurfacePos });

        TweenMax.set(o.bb8.bigEye, { x: bigEyeCenter + bigEyePos });
        TweenMax.set(o.bb8.pupilGroup, { x: pupilGroupCenter + pupilGroupPos });
        TweenMax.set(o.bb8.eyeHighlight, { x: eyeHighlightCenter + eyeHighlightPos });
        TweenMax.set(o.bb8.littleEye, { x: littleEyeCenter + littleEyePos });
        TweenMax.set(o.bb8.antennaShort, { x: antennaShortCenter + antennaShortPos });
        TweenMax.set(o.bb8.antennaLong, { x: antennaLongCenter + antennaLongPos });
    },
    wiggleHead: function wiggleHead() {

        if (o.wiggleFrame === o.allTheTime) {

            o.allTheTime = Math.floor(random(15, 30) / o.slowMoFactor); // How often does it wiggle

            o.ranDur = o.allTheTime / 60; // How fast does it wiggle

            o.ranPos = random(0.05, 0.3); // How much does it wiggle
            o.nowAndThen = chanceRoll(50); // How often does the head move
            o.moveAmount = random(-1, 1); // Takes random place on its range

            // Wiggle or move the head
            if (o.nowAndThen) {
                TweenMax.to(o.headNull, o.ranDur, { value: o.moveAmount, ease: Power3.easeInOut });
            } else {
                TweenMax.to(o.headNull, o.ranDur / 2, { value: "+=" + o.ranPos, ease: Power2.easeInOut, repeat: 1, yoyo: true });
            }

            o.wiggleFrame = 0; // Reset wiggleFrame count
        }

        o.wiggleFrame++;
    },
    blinkLights: function blinkLights() {

        // One in 10 there is a change
        if (chanceRoll(10 * o.slowMoFactor)) {

            for (var i = 0; i < 2; i++) {
                if (chanceRoll(50)) {
                    o.lightsOnOff[i] = 1;
                } else {
                    o.lightsOnOff[i] = 0;
                }
            }
        }

        TweenMax.set(o.bb8.upperLight, { autoAlpha: o.lightsOnOff[0] });
        TweenMax.set(o.bb8.lowerLight, { autoAlpha: o.lightsOnOff[1] });
    }
};

o.init();
