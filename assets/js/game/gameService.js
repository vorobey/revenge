'use strict';

import {GameMap} from './gameMap';
import { CanvasOperations } from '../core/canvasOperations';

var canvasOperations = CanvasOperations.instance;

export class GameService {
    constructor(config) {
        this.map = new GameMap(config.map);
        canvasOperations.calculateCells(config.map);
        var rulers = this.map.buildRulers();
        for (let i = 0; i < rulers.length; i++) {
            canvasOperations.drawLine(rulers[i]);
        }
    }
}