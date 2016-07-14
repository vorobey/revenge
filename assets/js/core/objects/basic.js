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
        this.id = guid();
        
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }

    move(x, y) {
        this.col += x;
        this.row += y;
    }

    remove() {
        this.hide();
        this.onRemove = true;
    }

    hide() {
        this.isHidden = true;
    }
}