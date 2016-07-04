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
        let cells = this.cells = [];
        var cellWidth = this.cellWidth = this.canvas.clientHeight / mapConfig.rows;
        var cellHeight = this.cellHeight = this.canvas.clientWidth / mapConfig.cols;

        for (var i = 0; i < mapConfig.rows; i++) {
            var row =  [];
            for (var j = 0; j < mapConfig.cols; j++) {
                let cell = [j * cellWidth, i*cellHeight, (j+1) * cellWidth, (i+1) * cellHeight];
                row.push(cell);
            }
            cells.push(row);
        }

        console.log(cells);
    }

    drawImage(object) {
        if (!this.ctx) {
            return false;
        }
        let coords = object.row && object.cell ? this.cells[object.row[object.cell]] : [object.x, object.y];
        if (object.width === '100%') {
            object.width = this.canvas.clientWidth;
        }
        if (object.height === '100%') {
            object.height = this.canvas.clientHeight;
        }


        var states = object.options.states;
        this.ctx.drawImage(
            object.image,
            coords[0],
            coords[1]
        );
    }

    drawLine(object) {
        if (!this.ctx) {
            return false;
        }
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
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    drawRect(object) {
        if (!this.ctx) { return false; }
        let ctx = this.ctx;
        ctx.strokeStyle = "#aaaaaa";
        ctx.rect(object.x, object.y, object.height, object.width);
        ctx.stroke();
    }

    erase() {

    }
}

