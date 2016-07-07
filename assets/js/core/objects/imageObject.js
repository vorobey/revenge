'use strict';

import { BasicObject } from './basic';
import { _ } from '../../../vendor/lodash';

/*
    *@class ImageObject - наследуемый от BasicObject класс для объекта-картинки
 */
export class ImageObject extends BasicObject {
    type = 'image';
    /*
        @prop imageUrl путь до изображения для объекта
     */
    get imageUrl() {
        return 'assets/images/hero.png';
    }

    constructor(props) {
        super(props);
        this.buildImage.apply(this);
    }

    buildImage() {
        this.image = new Image();
        this.image.src = this.imageUrl;
        this.image.onload = ()=> {
            this.onload && this.onload(this);
        }
    }
}