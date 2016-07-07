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
                let cell = {
                    x: j * cellWidth,
                    y: i*cellHeight,
                    x1: (j + 1) * cellWidth,
                    y1: (i + 1) * cellHeight
                };
                row.push(cell);
            }
            cells.push(row);
        }
    }

    draw(object) {
        if (!this.ctx) {
            return false;
        }
        let row = this.cells[object.row];
        let coords = row ? row[object.col] : null;

        if (!row || !coords) {
            object.isHidden = true;
            return false;
        }

        let width = object.width * this.cellWidth;
        let height = object.height * this.cellHeight;

        switch (object.type) {
            case 'image':
                this.drawImage(object, coords, width, height);
            break;
            case 'square':
                this.drawRect(object, coords, width, height);
            break;
            default:
                this.drawLine(object, coords, width, height);
        }
    }

    drawImage(object, coords, width, height) {
        this.ctx.drawImage(
            object.image,
            0,
            0,
            width,
            height,
            coords.x,
            coords.y,
            width,
            height
        );
    }

    drawLine(object, coords, width, height) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(width.width, height.height);
        ctx.strokeStyle = object.color || 'white';
        ctx.stroke();
    }
    drawRect(object, coords, width, height) {
        let ctx = this.ctx;
        ctx.strokeStyle = "#aaaaaa";
        ctx.rect(coords.x, coords.y, height, width);
        ctx.stroke();
    }

    clearField() {
        this.ctx.clearRect(0,0,this.canvas.clientWidth, this.canvas.clientHeight)
    }

    erase() {

    }
}

