'use strict';

//load vendor shit
import $ from '../../vendor/jquery';

//load core services
import { CanvasOperations } from '../core/canvasOperations';
import { AnimationService } from '../core/animationService';
import { CollisionService } from '../core/collisionService';

//load object classes for drawing
import { HeroObject } from '../game/heroObject';
import { EnemyObject } from '../game/enemyObject';
import { ObjectCollection } from '../core/objects/objectCollection';

var canvasOperations = CanvasOperations.instance;
var animationService = AnimationService.instance;
var collisionService = CollisionService.instance;

export class GameService {
    constructor(canvas, config) {
        console.log('gameServiceConstructor init');

        this.config = config;
        canvasOperations.setCanvas(canvas);
        canvasOperations.calculateCells(config.map);

        //создаем героя
        let hero = this.hero = new HeroObject({
            row: config.map.rows-3,
            col: 10,
            onload: function (hero) {
                animationService.objects.hero.addOne(hero);
            }
        });
        animationService.objects.hero = new ObjectCollection();

        this.buildCollisionRules();

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
                    this.startHeroWeaponMove(hero);
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
                    this.startHeroWeaponMove(hero);
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

        let enemies = this.enemies = [];

        for ( let j = 0; j < this.config.map.cols; j++ ) {
            for ( let i = 0; i < EnemiesRowCount; i++ ) {
                let row = i == 0 ? i : i * (EnemiesGap+EnemiesGap);
                let enemy = new EnemyObject({
                    col: j,
                    row: row,
                    onload: (enemy)=> {
                        animationService.objects.enemies.addOne(enemy);
                    }
                });
                enemies.push(enemy);
            }
            j += EnemiesGap;
        }

        animationService.objects.enemies = animationService.objects.enemies || new ObjectCollection();
        animationService.objects.enemyWeapon = animationService.objects.enemyWeapon || new ObjectCollection();

        // this.startEnemiesMoving(enemies);
        // this.startEnemyWeaponMove();

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

    startHeroWeaponMove() {
        animationService.objects.heroWeapon = animationService.objects.heroWeapon || new ObjectCollection();
        this.startWeaponMove(this.hero, animationService.objects.heroWeapon);
    }

    startEnemyWeaponMove() {
        // let enemyWeaponInterval = setInterval(() => {
        //     this.startWeaponMove(animationService.objects.enemies.collection[0], animationService.objects.enemies);
        // }, 500);
    }
    
    startWeaponMove(object, collection, speed = 1, time = 300) {
        let newWeapon = object.shoot(()=> {
            collection.addOne(newWeapon);
        });

        newWeapon.movingInterval = setInterval(()=>{
            newWeapon.move(0, -speed);
        }, 300);
    }

    buildCollisionRules() {
        collisionService.addRules('hero', 'enemies', function ( hero, enemy) {
            console.log('end of the game');
            animationService.stop();
        });

        collisionService.addRules('heroWeapon', 'enemies', function ( weapon, enemy ) {
            clearInterval(weapon.object.movingInterval);
            weapon.object.movingInterval = null;
            weapon.object.hide();
            enemy.object.hide();
            weapon.collection.removeById(weapon.object);
            enemy.collection.removeByIndex(enemy.index);
        });

        collisionService.addRules('hero', 'enemyWeapon', function ( hero, enemyWeapon ) {
            console.log('end of the game');
            animationService.stop();
        });
    }

    gameEnd() {
        //очищаем все интервалы и таймауты, останавливаем анимационный луп
    }

}