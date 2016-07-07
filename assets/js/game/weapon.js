'use strict';
import { ImageObject } from '../core/objects/imageObject';

export class WeaponObject extends ImageObject {
    height = 2;

    get imageUrl() {
        return 'assets/images/lightsaber.png'
    }
}
