//basic prototypes
var app = window.app || {};

var basicProtos = app.basicProtos = app.basicProtos || {};

/*
    proto for basic object on canvas field (hero, enemies, etc)
    for correct working we must pass some options for any created instance:
 */
basicProtos.CanvasObject =  (function() {
    // construct function
    function CanvasObject(options, letter) {
        //defalt options
        var defaults = app.config.config.object;
        this.init(_.merge({}, defaults, options), letter);
    }

    CanvasObject.prototype.init = function(options) {
        this.options = options;
        this.id = generateId();
        this.stateIndex = 1;
        this.stateKey = "default";

        this.animationService = this.options.animationService;
    };

    CanvasObject.prototype.setImage = function(callback) {
        var self = this;
        var image = self.image = new Image;
        image.src = self.options.imageSrc;
        image.onload = function() {
            callback();
        }
    };

    CanvasObject.prototype.draw = function(x, y) {
        var self = this;

        if (!this.animationService) {
            return false;
        }

        if (x) self.options.x = x;
        if (y) self.options.y = y;

        var callback = function() {
            self.options.width = self.image.width/self.options.states.default.length;
            self.options.height = self.options.states.angry && self.options.states.angry.length ? self.image.height/2 : self.image.height;
            if (self.options.area.length) {
                calculatePos.apply(self);
            }
            self.animationService.pushToLoop(self);
        };
        self.setImage(callback);
    };

    CanvasObject.prototype.changeState = function(state, immediate) {
        if (this.stateTimeout && !immediate) {
            return false;
        }

        if (immediate) {
            clearTimeout(this.stateTimeout);
            this.stateTimeout = null;
        }
        var self = this;

        if (!state) state = 'default';

        var newState = this.stateIndex + 1;
        if (newState > this.options.states[state].length) {
            newState = 1;
        }
        this.stateIndex = newState;
        this.stateKey = state;

        this.stateTimeout = setTimeout(function() {
            clearTimeout(this.stateTimeout);
            self.stateTimeout = null;
        }, 1000);

    };

    CanvasObject.prototype.move = function(newX, newY) {
        if (newX || newX == 0) this.options.x = newX;
        if (newY || newY == 0) this.options.y = newY;
    };

    CanvasObject.prototype.removeFromAnimation = function() {
        this.animationService.deleteFromLoop(this);
    };

    function generateId() {
        //moron function for generate ID of object, must include more code
        return 'id' + (Math.floor(Math.random() * (10000 - 1 + 1)) + 1) + '' + Date.now();
    }

    function calculatePos() {
        this.options.x = this.options.area[0] + ((this.options.area[2]-this.options.area[0]-this.options.width)/2);
        this.options.y = this.options.area[1] + ((this.options.area[3]-this.options.area[1]-this.options.height)/2);
    }


    return CanvasObject;

})();
