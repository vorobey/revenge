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

        for (let i = 0; i < canvasOperations.cells.length; i++) {
            let row = canvasOperations.cells[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                rulers.push(new RulerObject({
                    x:cell[0], y: cell[1], width: canvasOperations.cellWidth, height: canvasOperations.cellHeight
                }));
            }

        }
        return rulers;
    }
}
