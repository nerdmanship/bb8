"use strict";

var o = {

    // isIntro: true,
    // isRollingLeft: true,
    // currentTl: "none",
    box: document.querySelector(".box"),

    init: function init() {
        this.bindEvents();
        this.animate();
    },

    bindEvents: function bindEvents() {
        this.box.addEventListener("mouseup", this.animate.bind(this));
    }

};

o.init();
