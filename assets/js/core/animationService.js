'use strict';

import { CanvasOperations } from '../core/canvasOperations';

var canvasOperations = CanvasOperations.instance;

let singleton = Symbol();
let singletonEnforcer = Symbol();

/*
    @class AnimationService сервис для контроля за работой анимации
 */

export class AnimationService {
    /*
        
     */
    loop = [];
    lastCalledTime = Date.now();
    collisionStructures = [];

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


    checkCollisions() {
        // console.log(this.collisionStructures);
        let indexesToRemove = [];
        for (let i = 0; i < this.collisionStructures.length; i++) {
            indexesToRemove = [];
            let structure = this.collisionStructures[i];
            for (let j = 0; j < structure.with.length; j ++) {
                if (canvasOperations.checkCollision(structure.who, structure.with[j])) {
                    structure.what(structure.with[j]);
                    indexesToRemove.push(i);
                }
            }
        }

        for(let i = 0; i < indexesToRemove.length; i++) {
            console.log(indexesToRemove[i]);
            this.collisionStructures.splice(indexesToRemove[i], 1);
        }
    }


    render() {
        canvasOperations.clearField();
        _.each(this.loop,(item, index) => {
            if (item.isHidden) return;
           canvasOperations.draw(item);
        });

        this.checkCollisions();
    }
}
