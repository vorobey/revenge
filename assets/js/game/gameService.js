'use strict';

import {GameMap} from './gameMap';
import { CanvasOperations } from '../core/canvasOperations';

var canvasOperations = CanvasOperations.instance;

export class GameService {
    constructor(canvas, config) {
        canvasOperations.setCanvas(canvas);
        canvasOperations.calculateCells(config.map);

        //only for dev - show cells on canvas
        this.map = new GameMap(config.map);
        var rulers = this.map.buildRulers();
        for (let i = 0; i < rulers.length; i++) {
            canvasOperations.drawRect(rulers[i]);
        }
        //
        //draw test image
        var person = {};
        var image = person.image = new Image;
        image.src = 'images/hero.png';
        image.row = config.map.rows;
        image.col = 5;
        image.onload = function() {
            canvasOperations.drawImage(person);
        }
    }
}