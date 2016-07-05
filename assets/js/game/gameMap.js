'use strict';

import { SquareObject } from '../core/objects/squareObject';

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
                rulers.push(new SquareObject({
                    col: j, row: i
                }));
            }

        }
        console.log(rulers);
        return rulers;
    }
}
