// spaghetti starts here
var app = window.app || {};
var basicProtos = app.basicProtos = app.basicProtos || {};

/* 
	service for controling animations
	init draw, create objects, check collision, run animation loop, having enemies, weapons collections and init destroy or hide it
	todo: must be a singleton
*/
basicProtos.AnimationService =  (function() {
	function AnimationService(options) {
		var defaults = app.config.config.animation || {};
		this.init(_.merge({}, defaults, options));
	}

	AnimationService.prototype.init = function(options, reinit) {
		this.weapons = [];
		this.animationObjects = [];

		this.options = options;
		this.canvasService = app.service;

		this.hero = createHero.apply(this);
		this.enemies = generateEnemies.apply(this);

		bindKeyDowns.apply(this);

		this.doAnimationLoop.apply(this);
	};

	AnimationService.prototype.reinit = function(options) {
		if (options)
			this.options = _.merge(this.options, options);
		this.init(this.options);
	}

	AnimationService.prototype.run = function() {
		this.hero.draw();
		_.each(this.enemies, function(enemyCol){
			_.each(enemyCol, function(enemy) {
        		enemy.draw();	
			})
        })
        this.shakeEnemies();
	};

	AnimationService.prototype.shakeEnemies = function() {
		var self = this;
		var inc = 0;
		self.enemiesInterval = setInterval(function() {
			if (thereAreNoEnemies(self.enemies, self.options.enemyCols)) {
				clearInterval(self.enemiesInterval);
				self.stopAnimation();
				self.enemiesInterval = null;
			}
			_.each(self.enemies, function(enemyCol) {
				_.each(enemyCol, function(enemy) {
					var newY = enemy.options.y + self.options.enemyMovementStep;
					if (newY >= app.hero.options.y) {
						self.stopAnimation(true);
						return false;
					}
					enemy.move(null, newY);
				})
			})		
		}, self.options.enemyMovementSpeed);

		self.enemiesShootingInterval = setInterval(function() {
			self.enemiesShooting();
		}, self.options.weaponDebounce*6);
	};
	
	AnimationService.prototype.enemiesShooting = function() {
		var self = this;
		var enemies = self.enemies;
		if (thereAreNoEnemies(enemies, self.options.enemyCols)) {
			self.stopAnimation();
			return false;
		}
		var enemyToShoot = getRandomEnemyForShoot(enemies, self.options.enemyCols);

		releaseTheWeapon.apply(self, [enemyToShoot]);
	};

	function getRandomEnemyForShoot(enemies, maxCount) {
		var notEmpty = _.filter(enemies, function(item) {
			return !!item.length;
		});
		var col = notEmpty[getRandomInt(0, notEmpty.length-1)];
		if (!col) {
			return false;
		}
		return col[col.length-1];
	}

	function getRandomInt(min, max)	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	AnimationService.prototype.render = function() {
        var self = this;
        self.canvasService.clearField();
        _.each(self.animationObjects, function(item, index){
            self.canvasService.draw(item, {x:item.options.x, y: item.options.y});
        });
        var enemy = getRandomEnemyForShoot(self.enemies, self.enemies.length);
        enemy.changeState();
        app.hero.changeState();
        checkCollision.apply(self);
    };

    var lastCalledTime;
    var fps;

    AnimationService.prototype.doAnimationLoop = function() {
        var self = this;
        self.animId = window.requestAnimationFrame(self.doAnimationLoop.bind(self));
        self.render();
        //update fps counter
        if (!lastCalledTime) {
        	lastCalledTime = Date.now();
        	fps = 0;
        	return;
        }
        delta = (new Date().getTime()-lastCalledTime)/1000;
        lastCalledTime = Date.now();
        fps = Math.round(1/delta);
    	var fpsEvent = document.createEvent("CustomEvent");
    	fpsEvent.initCustomEvent("updateFPS", true, true, {'value': fps});
        document.dispatchEvent(fpsEvent)
    };

    AnimationService.prototype.pushToLoop = function(object) {
        this.animationObjects.push(object);
    };

    AnimationService.prototype.stopAnimation = function(isFail) {
    	var self = this;
    	window.cancelAnimationFrame(self.animId);
    	var eventName = isFail ? 'fail' : 'win';
    	var event = new Event(eventName);
    	document.dispatchEvent(event);
    };

    AnimationService.prototype.deleteFromLoop = function(object) {
        var self = this;
        var removed = _.remove(self.animationObjects, function(inListObject) {
            return inListObject.id == object.id;
        });
        if (removed) {
            return true;
        }
    };

	function generateEnemies() {
		var self = this;
		var field = this.canvasService.options.field;
		var cellWidth = field.width/self.options.enemyCols;
		var cellHeight = self.options.enemyHeight;
		var enemies = [];

		for(var i=0; i < self.options.enemyCols; i++) {
			var enemyCol = [];
			for(var j=0; j < self.options.enemyPerCol; j++) {
			    var enemy =  new app.basicProtos.CanvasObject({
			        imageSrc: app.config.enemy.imageSrc,
			        animationService: self,
			        area: [cellWidth*i, j*cellHeight, cellWidth*(i+1), j*cellHeight+cellHeight],
			        states: {
						default: [[0,0], [1,0]],
						angry: [[0,1]]
					}
			    });
		    	enemyCol.push(enemy);
			}
			enemies.push(enemyCol);
		}
		return enemies;
	}

	function generateWeapon(isHero) {
		var src = isHero ? app.config.weapon.imageSrc : app.config.enemyWeapon.imageSrc
		return new app.basicProtos.CanvasObject({
            imageSrc: src,
            animationService: this,
            heroWeapon: isHero,
        });
	}

	function createHero() {
		var field = this.canvasService.options.field;
		return app.hero = new app.basicProtos.CanvasObject({
	        imageSrc: app.config.hero.imageSrc,
	        animationService: this,
	        isHero: true,
	        area: [0, field.height-80, field.width, field.height],
	        statesCols: 1,
			statesRows: 1,
			states: {
				default: [[0,0], [1,0]],
				angry: [[0,1]]
			}
	    });
	}

	function releaseTheWeapon(object) {
		//generate weapon, draw && start move it
		var self = this;

		if (!object) { return false; };

		var isHero = !!object.options.isHero;
		var delta = isHero ? self.options.weaponStep : -self.options.weaponStep;

		var weapon = generateWeapon.apply(self, [isHero]);
		self.weapons.push(weapon);

		var initialCors = {};
		initialCors.x = object.options.x+(object.options.width/2)
		initialCors.y = isHero ? object.options.y-object.options.height : object.options.y + object.options.height;

		weapon.draw(initialCors.x, initialCors.y);
		weapon.movement = setInterval(function() {
			var newY = weapon.options.y - delta;
			weapon.move(null, newY);
			if (newY+weapon.options.height <= self.options.weaponStep) {
				destroyWeapon.apply(self, [weapon])
			}
		}, self.options.weaponSpeed);

		object.changeState('angry', true);

		self.weaponTmt = setTimeout(function() {
			clearTimeout(self.weaponTmt);
			self.weaponTmt = null;
		}, self.options.weaponDebounce);
	}

	function destroyWeapon(weapon) {
		var self = this;
		clearInterval(weapon.movement)
		weapon.movement = null;
		self.deleteFromLoop(weapon);
		_.remove(self.weapons, function(item) {
			return item.id == weapon.id;
		})
	}


	function destroyEnemy(enemy) {
		var self = this;
		self.deleteFromLoop(enemy);
		_.remove(self.enemies, function(enemyCol) {
			_.remove(enemyCol, function(item) {
				return item.id == enemy.id;
			})
		})
		var event = new Event('killTheEnemy');
    	document.dispatchEvent(event);
	} 

    function checkCollision() {
    	var self = this;
    	var hero = self.hero;
    	//check enemies
        _.each(self.enemies, function(enemyCol) {
        	_.each(enemyCol, function(enemy) {
	        	var heroWeapons = _.filter(self.weapons, function(weapon) { return weapon.options.heroWeapon});
	            _.each(heroWeapons, function(weapon) {
	                if (isColision(enemy, weapon)) {
	                   	destroyEnemy.apply(self, [enemy]);
	                	destroyWeapon.apply(self, [weapon]);	
	                    return false;
	                }
	            })
        	})
        })

        //check if enemiesweapon are on our hero
        var enemiesweapons = _.filter(self.weapons, function(weapon) { return !weapon.options.heroWeapon });
        _.each(enemiesweapons, function(enemyWeapon) {
        	if (isColision(hero, enemyWeapon))  {
        		self.stopAnimation(true);
        	}
        })
    }


    function isColision(object1, object2) {
    	var pos1 = {
    		top: object1.options.y,
    		bottom: object1.options.y + object1.options.height,
    		left: object1.options.x,
    		right: object1.options.x + object1.options.width
    	};
    	var pos2 = {
    		top: object2.options.y,
    		bottom: object2.options.y + object2.options.height,
    		left: object2.options.x,
    		right: object2.options.x + object2.options.width
    	};

    	return !(pos1.left > pos2.right || pos2.left > pos1.right || pos1.top > pos2.bottom || pos2.top > pos1.bottom);
    }

	function bindKeyDowns() {
		var self = this;
		var hero = self.hero;
		var movementLeft, movementRight;
		$(document).on('keydown', function(e) {
	        if (e.keyCode == 37) {
	        	if (!movementLeft) {
		        	movementLeft = setInterval(function() {
		        		var newX = hero.options.x-10;
		        		if (newX <= 0) {return false};
		          		hero.move(hero.options.x-10, null);
		        	}, 17)
	        	}
	        } else if (e.keyCode == 39) {
	        	if (!movementRight) {
		        	movementRight = setInterval(function() {
		        		var newX = hero.options.x+10;
		        		if (newX+hero.options.width >= self.canvasService.options.field.width) { return false }
		            	hero.move(hero.options.x+10, null);
		        	}, 17)
	        	}
	        } else if (e.keyCode == 32) {
	        	if (!self.weaponTmt) {
	        		releaseTheWeapon.apply(self, [self.hero]);
	        	}
	        }
	    })

	    $(document).on('keyup', function(e) {
	        if (e.keyCode == 37) {
	          	clearInterval(movementLeft);
	          	movementLeft = null;
	        } else if (e.keyCode == 39) {
	        	clearInterval(movementRight);
	        	movementRight = null;
	        } else if (e.keyCode == 32) {
	        	if (!self.weaponTmt) {
	        		releaseTheWeapon.apply(self);
	        	}
	        }
	    })
	}

	function thereAreNoEnemies(enemies, allLength) {
		if (!enemies || !enemies.length) {
			return true;
		}
		var empt = [];
		for (var i = 0; i < enemies.length; i++) {
			if ( !enemies[i] || (enemies[i] && !enemies[i].length)) {
				 empt.push(i);
			}
		}

		return empt.length == allLength;
	}

    return AnimationService;

})();
