'use strict';

import { styles } from '../sass/style.sass';

import 'babel-polyfill';
import { map, game } from 'json!../files/data.json';

import {GameService} from './game/gameService';



window.onload = () => {
    let battlefield = document.getElementById('battlefield');
    let gameService = new GameService(battlefield, {
        map: map,
        game: game
    });
};