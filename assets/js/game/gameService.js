'use strict';

//load vendor shit
import $ from '../../vendor/jquery';
import jQuery from '../../vendor/jquery';

//load core services
import { CanvasOperations } from '../core/canvasOperations';
import { AnimationService } from '../core/animationService';

//load object classes for drawing
import { GameMap } from './gameMap';
import { HeroObject } from '../game/heroObject';
import { EnemyObject } from '../game/enemyObject';

var canvasOperations = CanvasOperations.instance;
var animationService = AnimationService.instance;

export class GameService {
    constructor(canvas, config) {
        this.config = config;

        canvasOperations.setCanvas(canvas);
        canvasOperations.calculateCells(config.map);

        console.log('gameServiceConstructor');

        //only for dev - show cells on canvas
        // this.map = new GameMap(config.map);
        // var rulers = this.map.buildRulers();
        // for (let i = 0; i < rulers.length; i++) {
        //     // canvasOperations.draw(rulers[i]);
        //     animationService.pushToLoop(rulers[i]);
        // }

        //создаем героя
        let hero = new HeroObject({
            row: config.map.rows-3,
            col: 10,
            onload: function (hero) {
                // canvasOperations.draw(hero);
                animationService.pushToLoop(hero);
            }
        });
        //запускаем анимационный луп
        animationService.run();
        //навешиваем обработчики на клавиши для движения персонажа
        this.bindKeys(hero);
        //показываем вражин
        this.generateEnemies();
    }

    bindKeys(hero) {
        const MovementStep = 1;
        const MovementDelay = 50;
        let self = this;
        let movementLeft, movementRight, shootTmt;
        let setShootTmt = ()=> {
            shootTmt =  setTimeout(()=> {
                clearTimeout(shootTmt);
                shootTmt = null;
            }, 1000);
        };
        $(document).on('keydown', (e) => {
            if (e.keyCode == 37) {
                if (!movementLeft) {
                    movementLeft = setInterval(function() {
                        hero.move(-MovementStep, 0);
                    }, MovementDelay)
                }
            } else if (e.keyCode == 39) {
                if (!movementRight) {
                    movementRight = setInterval(function() {
                        hero.move(MovementStep, 0);
                    }, MovementDelay)
                }
            } else if (e.keyCode == 32) {
                if (!shootTmt) {
                    this.startWeaponMove(hero);
                    setShootTmt();
                }
            }
        });

        $(document).on('keyup', (e)=> {
            if (e.keyCode == 37) {
                clearInterval(movementLeft);
                movementLeft = null;
            } else if (e.keyCode == 39) {
                clearInterval(movementRight);
                movementRight = null;
            } else if (e.keyCode == 32) {
                if (!shootTmt) {
                    this.startWeaponMove(hero);
                    setShootTmt();
                }
            }
        });


    }

    //строим матрицу для размещения вражин и размещаим
    generateEnemies() {
        //сколько строк карты должно быть заполнено вражинами
        const EnemiesRowCount = 3;
        //какое расстояние между вражинами (одна клетка - оптимально, думаю)
        const EnemiesGap = 2;

        let enemies = [];

        for ( let j = 0; j < this.config.map.cols; j++ ) {
            for ( let i = 0; i < EnemiesRowCount; i++ ) {
                let row = i == 0 ? i : i * (EnemiesGap+EnemiesGap);
                let enemy = new EnemyObject({
                    col: j,
                    row: row,
                    onload: (enemy)=> {
                        animationService.pushToLoop(enemy);
                    }
                });

                enemies.push(enemy);
            }
            j += EnemiesGap;
        }

        // this.startEnemiesMoving(enemies);

        return true;
    }

    startEnemiesMoving(enemies) {
        const MovingSpeed = 1500;
        const MovingStep = 1;
        let interval = setInterval(()=> {
            for (let i = 0; i < enemies.length; i++) {
                enemies[i].move(0, 1);
            }
        }, MovingSpeed);
    }

    startWeaponMove(hero) {
        const speed = 1;
        let newWeapon = hero.shoot(()=> {
            animationService.pushToLoop(newWeapon);
        });

        newWeapon.movingInterval = setInterval(()=>{
            newWeapon.move(0, -speed);
        }, 300);
    }
}