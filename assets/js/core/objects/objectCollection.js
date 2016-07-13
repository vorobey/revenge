'use strict';

import _ from 'lodash';

export class ObjectCollection {
    collection = [];
    constructor(objects) {
        this.add(objects);
    }

    add(objects) {
        _.merge(this.collection, objects);
    }

    addOne(object) {
        this.collection.push(object);
    }

    getAll() {
        return this.collection;
    }

    removeByIndex(index, count = 1) {
        this.collection.splice(index, count)
    }
}