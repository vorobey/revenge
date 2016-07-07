import { ImageObject } from '../core/objects/imageObject';

export class HeroObject extends ImageObject {
    get imageUrl() {
        return 'assets/images/hero.png';
    }

    constructor(props) {
        super(props);
        
    }

    shoot() {
        
    }
}