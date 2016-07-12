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
    collisionRules = {};

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

    /*
        @method checkCollisions проверка объектов из лупа на коллизии
                @todo: оптимизировать, минимизируя лишние вычисления
     */

    checkCollisions() {
        for(let i = 0; i < this.loop.length; i++) {
            let currObj = this.loop[i];
            for (let j = 0; j < this.loop.length; j++) {
                if (j == i) continue;
                let compareObj = this.loop[j];
                if (canvasOperations.checkCollision(currObj, compareObj)) {
                    //смотрим что за объекты, сопоставляем с collisionRules

                }

            }
        }
    }

    render() {
        this.checkCollisions();

        canvasOperations.clearField();
        _.each(this.loop,(item, index) => {
            if (item.isHidden) return;
           canvasOperations.draw(item);
        });
    }
}
