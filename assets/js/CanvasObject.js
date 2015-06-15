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
            self.options.width = self.image.width;
            self.options.height = self.image.height;
            if (self.options.area.length) {
                self.options.x = self.options.area[0] + ((self.options.area[2]-self.options.area[0]-self.options.width)/2);
                self.options.y = self.options.area[1] + ((self.options.area[3]-self.options.area[1]-self.options.height)/2);
                console.log(self.options.x, self.options.y, self.options.area, self)
            }
            self.animationService.pushToLoop(self);
        };
        self.setImage(callback);
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


    return CanvasObject;

})();
