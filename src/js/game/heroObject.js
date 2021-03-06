import { ImageObject } from '../core/objects/imageObject';
import { WeaponObject } from './weapon';

export class HeroObject extends ImageObject {
    width = 2;
    height = 2;
    get imageUrl() {
        return 'src/images/hero.png';
    }

    constructor(props) {
        super(props);
    }

    shoot(onload) {
        return new WeaponObject({row: this.row, col: this.col, onload: onload});
    }
}