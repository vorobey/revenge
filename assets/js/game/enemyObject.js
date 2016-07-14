'use strict';

import { HeroObject } from './heroObject';

export class EnemyObject extends HeroObject {
    get imageUrl() {
        return 'assets/images/enemy_1.png';
    }

    constructor(props) {
        super(props);
    }

}