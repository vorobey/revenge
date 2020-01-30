'use strict';

import { CanvasOperations } from './canvasOperations';
import { CollisionService } from './collisionService';

var canvasOperations = CanvasOperations.instance;

let singleton = Symbol();
let singletonEnforcer = Symbol();

/*
    @class AnimationService сервис для контроля за работой анимации
 */

export class AnimationService {
    /*
        
     */
    objects = {};
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

    stop() {
        window.cancelAnimationFrame(this.animId);
        this.animId = null;
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
        CollisionService.instance.processObjects(this.objects);

        canvasOperations.clearField();
        _.each(this.objects,(collectionInst, index) => {
            let collection = collectionInst.getAll();
            _.each(collection, (item, index) => {
                if (item.isHidden) return;
                canvasOperations.draw(item);
            });

        });
    }

}
