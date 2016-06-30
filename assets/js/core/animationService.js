'use strict';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class AnimationService {
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
}

export default AnimationService;