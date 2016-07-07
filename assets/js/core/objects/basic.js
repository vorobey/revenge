'use strict';

/**
 * @class BasicObject базовый класс объектов для отрисовки на полотне
 */
export class BasicObject {
    /*
       @prop type {string} тип объекта. По этому пропсу определяется, какой метод будет вызван для отрисовки.
     */
    type = 'line';
    /*
     @prop color {string} цвет обводки, может быть вида hex
     */
    color = 'white';

    /*
     @prop strokeWidth толщина линии обводки
     */
    strokeWidth = 1;

    /*
        @prop height {Number} высота объекта в ячейках
     */
    height = 1;
    /*
     @prop width {Number} ширина объекта в ячейках
     */
    width = 1;
    /*
     @prop x {Number} номер строки
     */
    x = 0;
    /*
     @prop y {Number} номер ячейки в строке
     */
    y = 0;

    /*
        @method constructor конструктор объекта
        @param props {Object} - проперти для объекта. обычно это координаты и размеры
     */
    constructor(props) {
        _.merge(this, props);
    }

    move(x, y) {
        this.col += x;
        this.row += y;
    }
}