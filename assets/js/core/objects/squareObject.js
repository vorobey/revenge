'use strict';

import { BasicObject } from './basic';
import { _ } from '../../../vendor/lodash';

/*
 *@class ImageObject - наследуемый от BasicObject класс для объекта-картинки
 */
export class SquareObject extends BasicObject {
    type = 'square';

    constructor(props) {
        super(props);
    }

}