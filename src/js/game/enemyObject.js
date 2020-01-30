'use strict';

import { HeroObject } from './heroObject';

export class EnemyObject extends HeroObject {
    get imageUrl() {
        return 'src/images/enemy_1.png';
    }

    constructor(props) {
        super(props);
    }
    
    shoot(onload) {
        return new WeaponObject({row: this.row, col: this.col, onload: onload});
    }
}