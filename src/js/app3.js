var o = {

    // isIntro: true,
    // isRollingLeft: true,
    // currentTl: "none",
    box: document.querySelector(".box"),
    
    init: function() {
        this.bindEvents();
        this.animate();
    },
    
    bindEvents: function () {
        this.box.addEventListener("mouseup", this.animate.bind(this));
    },
    
    // getRollAnim: function (direction) {
    //     // Inventory values separated by rolling direction
    //     var spinDir;

    //     if (direction === "left") {
    //         spinDir = "-=360";
    //     } else {
    //         spinDir = "+=360";
    //     }
    //     var tl = new TimelineMax();

    //     // Define multi directional roll animation here
    //     tl
    //         .to(o.box, 2, { rotation: spinDir, transformOrigin: "center", ease: Linear.easeNone, repeat: 300 });
        
    //     return tl;
    // },
    
    // animate: function() {
    //     if (this.isIntro) {
    //         o.playIntro();
    //     } else {
    //         o.stopPlayNext();
    //     }
    // },
    
    // playIntro: function() {
    //     o.isIntro = false;
    //     o.currentTl = o.getRollAnim("left");
    //     o.currentTl.play();
    // },

    // stopPlayNext: function() {
    //     var dir;
    //     if (o.isRollingLeft) {
    //         o.isRollingLeft = false;
    //         dir = "right";
    //     } else {
    //         o.isRollingLeft = true;
    //         dir = "left";
    //     }
    //         TweenMax.to(o.currentTl, 1, { timeScale: 0, onComplete: o.roll, onCompleteParams: [dir] });

    // },

    // roll: function(dir) {
    //     o.currentTl.kill();
    //     o.currentTl = o.getRollAnim(dir);
    //     o.currentTl.play().timeScale(0);
    //     TweenMax.to(o.currentTl, 1, { timeScale: 1 });
    // }
    
};

o.init();


