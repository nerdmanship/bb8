
// Connect iris and highlights to headNull

function random(min, max) {
  if (max === null) { max = min; min = 0; }
  return Math.random() * (max - min) + min;
}

function chanceRoll(chance) {
  if (chance === null) { chance = 50; }
  return chance > 0 && Math.random() * 100 <= chance;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var o = {
    // Keep track on timelines to be turned on and off on direction change
    isIntro: true,
    isRollingLeft: false,
    currentTl: [],
    currentGravelTl: [],
    gravelProgress: [],
    prevGravelProgress: [],
    // Head light status on/off
    lightsOnOff: [0,0],
    // Wiggle head
    wiggleFrame: 0,
    allTheTime: 0,
    ranDur: 0,
    ranPos: 0,
    nowAndThen: 0,
    moveAmount: 0,
    // Null object to parallax head components
    headNull: {
        value: 0
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.setStart();
        this.connectHeadToNull();
        this.blinkLights();
        this.animate();
    },
    cacheDOM: function() {
        this.svg = document.querySelector("[data-bb8=svg]");
        this.gravelGroup = this.svg.querySelector("[data-bb8=gravelGroup]");
        this.gravel = this.svg.querySelectorAll("[data-bb8=gravel]");
        this.largeMask = this.svg.querySelector("[data-bb8=largeMask]");
        this.animElems = ["bb8","unit","bodySurface","rotatingHead","headShadowBig","headShadowSmall","bouncingHead","antennaLong","antennaShort","headSurface", "upperLight", "lowerLight", "littleEye","bigEye","pupil1","pupil2","pupil3","pupil4"];
        this.bb8 = {};
        for (var i = 0; i < this.animElems.length; i++) {
            this.bb8[this.animElems[i]] = this.svg.querySelector("[data-bb8=" + this.animElems[i] + "]");
        }
    },
    bindEvents: function() {
        this.bb8.bb8.addEventListener("mouseup", this.animate.bind(this));
        //this.bb8.bb8.addEventListener("mouseover", this.slowMoOn.bind(this));
        //this.bb8.bb8.addEventListener("mouseout", this.slowMoOff.bind(this));
    },
    setStart: function() {
        TweenMax.set(this.svg, { autoAlpha: 1 });
        TweenMax.set(this.largeMask, {scale: 0, transformOrigin: "center" });
        TweenMax.set(this.bb8.bb8, { y: 3500, x: 2900, scale: 2.5, transformOrigin: "center bottom" });
        TweenMax.set(this.bb8.rotatingHead,{ rotation: 20, transformOrigin: "center" });
        o.spreadGravel();
    },
    spreadGravel: function() {
        TweenMax.set(o.gravelGroup, { x: -50 });
        
        for (var i = 0; i < o.gravel.length; i++) {
            TweenMax.set(o.gravel[i], { x: 0, y: random(100, 800) });
        }
        o.getGravelAnims("right");
    },
    getRollAnims: function (direction) {
        var tls = o.getGravelAnims(direction);

        // Inventory values separated by rolling direction
        var spinDir;

        if (direction === "left") {
            spinDir = "-=360";
        } else {
            spinDir = "+=360";
        }
        var tl = new TimelineMax( { onUpdate: o.wiggleHead });

        // Define multi directional roll animation here
        tl
            // Repeating roll - tot 500s
            .to(this.bb8.bodySurface, 0.5, { rotation: spinDir, transformOrigin: "center", ease: Linear.easeNone, repeat: 1000 }, 0)
            
            // Correct positions
            .to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, 0)
            .to(this.bb8.bb8, 1, { y: 700, scale: 1.18, transformOrigin: "center bottom", ease: Power1.easeInOut }, 0)
            .to(this.bb8.bodySurface, 1, { y: -400, ease: Power1.easeInOut }, 0)
            .to(this.bb8.bodySurface, 2, { x: -600, ease: Power1.easeInOut }, 0)
            .to(this.bb8.unit, 0.05, { y: 0, ease: Power1.easeInOut }, 0)
            .to(this.bb8.bouncingHead, 0.05, { y: 0, ease: Power1.easeInOut }, 0)

            // Repeating values

            // Moving X/Y
            .to(this.bb8.bb8, 5, { x: "-=300", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2)
            .to(this.bb8.bb8, 2, { y: "-=400", scale: 1, transformOrigin: "center bottom", ease: Power1.easeInOut, repeat: 1000, yoyo:true }, 1)
            .to(this.bb8.bodySurface, 2, { y: "-=350", ease: Power1.easeInOut, repeat: 1000, yoyo: true }, 1)
            .to(this.bb8.bodySurface, 5, { x: "+=200", ease: Power1.easeInOut, repeat: 500, yoyo: true }, 2)
            
            // Bouncing
            .to(this.bb8.unit, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo:true }, 0.05)
            .to(this.bb8.bouncingHead, 0.05, { y: "-=10", ease: Power1.easeInOut, repeat: 20000, yoyo:true }, 0.05)
            
            // Rotating head
            // ...
            
            // Spinning head
            //.fromTo(this.headNull, 1, { value: 1 }, { value: -1, ease: Linear.easeNone, repeat: 500, yoyo:true }, 0)
            ;
    
        tls[tls.length] = tl;
        return tls;
    },
    getIntroAnim: function() {
        var tl = new TimelineMax();

        tl
            .add("")
            .to(this.largeMask, 1.5, { scale: 0.95, ease: Back.easeInOut.config(1) })
            .add("bb8-in")
            .to(this.bb8.bb8, 5.5, { x: 2000, y: 4300, scale: 3, ease: Elastic.easeOut.config(10) }, "bb8-in")
            .to(this.bb8.bodySurface, 5.5, { rotation: -30, transformOrigin: "center", ease: Elastic.easeOut.config(10) }, "bb8-in")

            .to(this.bb8.rotatingHead, 0.1, { rotation: -20, transformOrigin: "center" }, "bb8-in =+0.3")
            .to(this.bb8.rotatingHead, 0.1, { rotation: 20, transformOrigin: "center" }, "bb8-in =+1.4")
            .to(this.bb8.rotatingHead, 3, { rotation: -15, transformOrigin: "center", ease: Elastic.easeOut.config(0.5) }, "bb8-in =+1.5")
            .to(this.bb8.bouncingHead, 0.2, { y: "-=10", ease: Power3.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.4 }, "bb8-in =+2")
            .to(this.bb8.bouncingHead, 0.35, { y: "+=15", ease: Power1.easeInOut, repeat: 2, yoyo: true, repeatDelay: 0.2 }, "bb8-in =+3.4")
            .to(this.bb8.bouncingHead, 0.275, { y: "-=5", repeat: 1, yoyo: true, repeatDelay: 0.1, ease: Power4.easeInOut }, "bb8-in =+4.85")

            .add("bb8-flirt")
            // Staggering eye
            // ...
            // Rotating head
            // ...
            // Spinning head
            // ...
            
            .add("bb8-out")
            .to(this.bb8.bb8, 1, { x: 4500, ease: Back.easeIn.config(2) }, "bb8-out")
            .to(this.bb8.bodySurface, 1, { rotation: 30, ease: Back.easeIn.config(2) }, "bb8-out")
            .set(this.bb8.bb8, { y: 600, scale: 1, transformOrigin: "center bottom" })
            .add(o.animate)
            // .add("startRolling")
            // .add(o.spinHead, "startRolling")
            // .to(this.bb8.bb8, 2, { x: 500, ease: Back.easeOut }, "startRolling")
            ;
        return tl;
    },
    getGravelAnims: function(direction) {
        // Make an array for timelines
        var tls = [];

        // Iterate thru gravel array, create unique timelines for each and add them to timelines array
        for (var i = 0 ; i < o.gravel.length; i++) {
            // Values for all timelines all times
            var speed = 0.5;
            var fromX = ( direction === "left" ) ? 0 : 2935;
            var toX = ( direction === "left" ) ? 2935 : 0;
                
            // Generate seamless progress values
            if ( o.prevGravelProgress.length != o.gravel.length ) {
                // If prev array not full of values, then give each gravel a randomize progress value
                o.gravelProgress[i] = random(0, 1);
                // ...and push it into the prev array
                o.prevGravelProgress[i] = o.gravelProgress[i];
            } else {
                // If prev array is full of values, then inverse each value
                o.gravelProgress[i] = 1 - o.prevGravelProgress[i];
            }
            
            // Create an individual timeline
            var tl = new TimelineMax( {repeat: 2000 });
            

            // Define the tween and set the playhead at correct progress
            tl
                .fromTo(o.gravel[i], speed, { x: fromX }, { x: toX, ease: Linear.easeNone })
                .progress(o.gravelProgress[i])
                .paused(true)
            ;

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
    animate: function() {
        if (this.isIntro) {
            o.playIntro();
        } else {
            o.stopPlayNext();
        }
    },
    playIntro: function() {
        o.isIntro = false;
        o.currentTl[0] = o.getIntroAnim();
        o.currentTl[0].play();
    },
    
    stopPlayNext: function() {
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

    roll: function(direction) {
        
        // If first time roll is called
        if ( o.currentTl.length != 1 ) { o.recordProgress(); }
        
            // Record the progress value where each gravel stopped
            var tls = o.getRollAnims(direction);
            // Start wiggle head
            //o.wiggleHead();
        
        for(var i = 0; i < o.currentTl.length; i++ ) {
            o.currentTl[i].kill();
        }

        for(var j = 0; j < tls.length; j++ ) {
            
            o.currentTl[j] = tls[j];

            o.currentTl[j].play().timeScale(0);
            
            TweenMax.to(o.currentTl[j], 1, { timeScale: 1 });
            
        }
    },
    recordProgress: function() {
        for (var i = 0 ; i < o.gravel.length; i++) { o.prevGravelProgress[i] = o.currentTl[i].progress(); }
    },
    slowMoOn: function() {
         for(var i = 0; i < o.currentTl.length; i++ ) {
            TweenMax.to(o.currentTl[i], 0.1, { timeScale: 0.05 });
        }  
    },
    slowMoOff: function() {
         for(var i = 0; i < o.currentTl.length; i++ ) {
            TweenMax.to(o.currentTl[i], 0.1, { timeScale: 1 });
        }  
    },
    connectHeadToNull: function() {
        if (!val) {
            var val, headSurfacePos, bigEyePos, littleEyePos, antennaShortPos, antennaLongPos;
            var headSurfaceCenter = -50;
            var bigEyeCenter = 217+headSurfaceCenter;
            var littleEyeCenter = 385+headSurfaceCenter;
            var antennaShortCenter = -50;
            var antennaLongCenter = -50;
        }
        // Update value
        val = o.headNull.value;
        
        // null value (+/-1) * range/2
        headSurfacePos = val*150;
        bigEyePos = val*150;
        littleEyePos = val*150;
        antennaShortPos = -val*120;
        antennaLongPos = -val*70;

        TweenMax.set(o.bb8.headSurface, { x: headSurfaceCenter + headSurfacePos });

        TweenMax.set(o.bb8.bigEye, { x: bigEyeCenter + bigEyePos });
        TweenMax.set(o.bb8.littleEye, { x: littleEyeCenter + littleEyePos });
        TweenMax.set(o.bb8.antennaShort, { x: antennaShortCenter + antennaShortPos });
        TweenMax.set(o.bb8.antennaLong, { x: antennaLongCenter + antennaLongPos });

        
        window.requestAnimFrame(o.connectHeadToNull);
    },
    wiggleHead: function() {
        
        if ( o.wiggleFrame === o.allTheTime ) {
            
            o.allTheTime = Math.floor(random(20, 40)); // How often does it wiggle
            
            o.ranDur = o.allTheTime/60; // How fast does it wiggle
            
            o.ranPos = random(0.05, 0.1); // How much does it wiggle
            o.nowAndThen = chanceRoll(50); // How often does the head move
            o.moveAmount = random(-1, 1); // Takes random place on its range
            
            // Wiggle or move the head
            if ( o.nowAndThen ) {
                TweenMax.to(o.headNull, o.ranDur, { value: o.moveAmount, ease: Power3.easeInOut });
            } else {
                TweenMax.to(o.headNull, o.ranDur, { value: "+=" + o.ranPos, ease: SlowMo.ease.config(0.1, 0.1, true) });
            }

            o.wiggleFrame = 0; // Reset wiggleFrame count
        }

        o.wiggleFrame++;
        //window.requestAnimFrame(o.wiggleHead);
    },
    blinkLights: function() {
        
        // One in 10 there is a change
        if ( chanceRoll(10) ) {

            for (var i = 0; i < 2; i++ ) {
                if ( chanceRoll(50) ) {
                    o.lightsOnOff[i] = 1;
                } else {
                    o.lightsOnOff[i] = 0;
                }
            }

        }

        TweenLite.set(o.bb8.upperLight, { autoAlpha: o.lightsOnOff[0] });
        TweenLite.set(o.bb8.lowerLight, { autoAlpha: o.lightsOnOff[1] });

        window.requestAnimFrame(o.blinkLights);

    }
};

o.init();