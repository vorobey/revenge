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
    objects = {};
    lastCalledTime = Date.now();
    collisionRules = [];

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

    /*
        @method checkCollisions проверка объектов из лупа на коллизии
                @todo: оптимизировать, минимизируя лишние вычисления
     */

    checkCollisions() {
        _.each(this.collisionRules, (rules, index) => {
            let collectionForCompare = this.objects[rules.who];
            let collectionToCompare = this.objects[rules.withWho];
            if (!collectionForCompare || !collectionToCompare) {
                return false;
            }
            let array1 = collectionForCompare.getAll();
            let array2 = collectionToCompare.getAll();
            for(let i = 0; i < array1.length; i++ ) {
                let object1 = array1[i];
                for(let j = 0; j < array2.length; j++ ) {
                    let object2 = array2[j];
                    if (canvasOperations.checkCollision(object1, object2)) {
                        rules.what && rules.what({
                            collection: collectionForCompare,
                            object: object1,
                            index: i
                        },
                        {
                            collection: collectionToCompare,
                            object: object2,
                            index: j
                        })
                    }
                }
            }
        });
    }

    render() {
        this.checkCollisions();

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
