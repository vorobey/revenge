'use strict';

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class CanvasOperations {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton"
        }
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new CanvasOperations(singletonEnforcer);
        }
        return this[singleton];
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    calculateCells(mapConfig) {
        this.cells = [];
        var cellWidth = this.canvas.clientHeight / mapConfig.rows;
        var cellHeight = this.canvas.clientWidth / mapConfig.cols;
        console.log(cellHeight, cellWidth);
    }

    drawImage(object) {
        if (!this.ctx) {
            return false;
        }
        if (object.width === '100%') {
            object.width = this.canvas.clientWidth;
        }
        if (object.height === '100%') {
            object.height = this.canvas.clientHeight;
        }
        // //dont draw object out of field. probably should delete it
        // if ((position.x+object.options.width < 0 || position.x-object.options.width > this.options.width) ||
        //     (position.y+object.options.height < 0 || position.y-object.options.height > this.options.height )) {
        //     return false;
        // }
        var states = object.options.states;
        this.ctx.drawImage(
            object.image,
            object.x,
            object.y
        );
    }

    drawLine(object) {
        if (!this.ctx) {
            return false;
        }
        console.log(object);
        if (object.width === '100%') {
            object.width = this.canvas.clientWidth;
        }
        if (object.height === '100%') {
            object.height = this.canvas.clientHeight;
        }
        let ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(object.x, object.y);
        ctx.lineTo(object.width, object.height);
        console.log('drawLine');
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    erase() {

    }
}

