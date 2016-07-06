'use strict';

import { CanvasOperations } from '../core/canvasOperations';

var canvasOperations = CanvasOperations.instance;

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class AnimationService {
    loop = [];
    lastCalledTime = Date.now();

    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton"
        }
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new AnimationService(singletonEnforcer);
        }
        return this[singleton];
    }

    run() {
        this.doAnimationLoop();
    }

    pushToLoop(object) {
        this.loop.push(object);
    }

    doAnimationLoop() {
        let fps, delta;
        this.animId = window.requestAnimationFrame(this.doAnimationLoop.bind(this));
        this.render();
        //update fps counter
        if (!this.lastCalledTime) {
            this.lastCalledTime = Date.now();
            fps = 0;
            return;
        }
        delta = (new Date().getTime()-this.lastCalledTime)/1000;
        this.lastCalledTime = Date.now();
        fps = Math.round(1/delta);
        var fpsEvent = document.createEvent("CustomEvent");
        fpsEvent.initCustomEvent("updateFPS", true, true, {'value': fps});
        document.dispatchEvent(fpsEvent)
    }

    render() {
        canvasOperations.clearField();
        _.each(this.loop,(item, index) => {
           canvasOperations.draw(item);
        });
        // var enemy = getRandomEnemyForShoot(self.enemies, self.enemies.length);
        // enemy.changeState();
        // app.hero.changeState();
        // checkCollision.apply(self);
    }
}
