'use strict';

import 'babel-polyfill';
import { map, game } from 'json!../files/data.json';

import {GameService} from './game/gameService';



window.onload = () => {
    let gameService = new GameService({
        map: map,
        game: game
    });
};