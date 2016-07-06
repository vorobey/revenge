'use strict';
//load core services
import { CanvasOperations } from '../core/canvasOperations';
import { AnimationService } from '../core/animationService';

//load object classes for drawing
import { GameMap } from './gameMap';
import { HeroObject } from '../game/heroObject';

var canvasOperations = CanvasOperations.instance;
var animationService = AnimationService.instance;

export class GameService {
    constructor(canvas, config) {
        canvasOperations.setCanvas(canvas);
        canvasOperations.calculateCells(config.map);

        //only for dev - show cells on canvas
        this.map = new GameMap(config.map);
        var rulers = this.map.buildRulers();
        for (let i = 0; i < rulers.length; i++) {
            // canvasOperations.draw(rulers[i]);
            animationService.pushToLoop(rulers[i]);
        }

        let hero = new HeroObject({
            row: config.map.rows-1,
            col: 10,
            onload: function (hero) {
                // canvasOperations.draw(hero);
                animationService.pushToLoop(hero);
            }

        });

        animationService.run();
    }
}