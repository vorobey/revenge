'use strict';

import { GameMap } from './gameMap';
import { CanvasOperations } from '../core/canvasOperations';

import { HeroObject } from '../game/heroObject';

var canvasOperations = CanvasOperations.instance;

export class GameService {
    constructor(canvas, config) {
        canvasOperations.setCanvas(canvas);
        canvasOperations.calculateCells(config.map);

        //only for dev - show cells on canvas
        this.map = new GameMap(config.map);
        var rulers = this.map.buildRulers();
        for (let i = 0; i < rulers.length; i++) {
            canvasOperations.draw(rulers[i]);
        }

        let hero = new HeroObject({
            row: config.map.rows-1,
            col: 10,
            onload: function (hero) {
                canvasOperations.draw(hero);
            }
        });
    }
}