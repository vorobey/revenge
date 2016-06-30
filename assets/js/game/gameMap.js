'use strict';

import { RulerObject } from './rulerObject';

import { CanvasOperations } from '../core/canvasOperations';

var canvasOperations = CanvasOperations.instance;

export class GameMap {
    constructor(mapConfig) {
        this.config = mapConfig;
    }

    buildRulers() {
        var rulers = [];
        var thickness = 1;

        for (let i = 0; i < this.config.rows; i++) {
            rulers.push(new RulerObject({x:i, y:0, height: thickness, width: '100%'}))
        }
        for (let i = 0; i < this.config.cols; i++) {
            rulers.push(new RulerObject({y:i, x:0, height: '100%', width: thickness}))
        }

        return rulers;
    }
}
