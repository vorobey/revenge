'use strict';

/*
    @class CollisionRule класс для хранения информации о правиле, применяемом для коллизии объекта who с withWho
 */

class CollisionRule {
    // @param {String} who - идентификатор сравниваемой коллекции в хэше объектов animationService
    who = 'hero';
    // @param {String} withWho - идентификатор коллекции для сравнения в хэше объектов animationService
    withWho = 'enemy';
    // @param {Void} what - коллбэк, который вызывается при коллизии
    what = () => console.log('collision!');

    constructor(who, withWho, what) {
        this.who = who;
        this.withWho = withWho;
        this.what = what;
    }
}
/*
    @class CollisionService сервис для работы с коллизиями
 */

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class CollisionService {
    rules = [];

    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton"
        }
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new CollisionService(singletonEnforcer);
        }
        return this[singleton];
    }

    init() {
        this.rules = [];
    }

    addRules(who, withWho, what) {
        this.rules.push(new CollisionRule(who, withWho, what));
    }

    processObjects(objects) {
        _.each(this.rules, (rules, index) => {
            let collectionForCompare = objects[rules.who];
            let collectionToCompare = objects[rules.withWho];
            if (!collectionForCompare || !collectionToCompare) {
                return false;
            }
            let array1 = collectionForCompare.getAll();
            let array2 = collectionToCompare.getAll();

            for(let i = 0; i < array1.length; i++ ) {
                let object1 = array1[i];
                for(let j = 0; j < array2.length; j++ ) {
                    let object2 = array2[j];
                    if (this.checkForCollision(object1, object2)) {
                        rules.what(this.makeCallbackObject(collectionForCompare, object1, i),
                            this.makeCallbackObject(collectionToCompare, object2, j));
                    }
                }
            }
        });
    }

    makeCallbackObject(collection, object, index) {
        return {
            collection: collection,
            object: object,
            index: index
        }
    }

    checkForCollision(object1, object2) {
        let pos1 = {
            top: object1.row,
            bottom: object1.row + object1.height,
            left: object1.col,
            right: object1.col + object1.width
        };
        let pos2 = {
            top: object2.row,
            bottom: object2.row + object2.height,
            left: object2.col,
            right: object2.col + object2.width
        };

        return !(pos1.left > pos2.right || pos2.left > pos1.right || pos1.top > pos2.bottom || pos2.top > pos1.bottom);
    }
}


