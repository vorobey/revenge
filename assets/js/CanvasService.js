//basic prototypes
var app = window.app || {};

var basicProtos = app.basicProtos = app.basicProtos || {};

/*
    wrapper for operations with canvas (like a draw, redraw, cleaning, etc)
    constructor CanvasOperationst
    todo: this is must be a singleton
 */

basicProtos.CanvasOperations = (function() {

    function CanvasOperations (options) {
        this.init(options)
    }
    CanvasOperations.prototype.init = function(options) {
        var self = this;
        self.options = options;
    };

    CanvasOperations.prototype.draw = function (object, position) {
        var self = this;
        var opts = self.options;
        if (!opts.ctx) {
            return false;
        }
        //dont draw object out of field. probably should delete it
        if ((position.x+object.options.width < 0 || position.x-object.options.width > this.options.width) ||
            (position.y+object.options.height < 0 || position.y-object.options.height > this.options.height )) {
            return false;
        }
        opts.ctx.drawImage(object.image, position.x, position.y);

    };

    CanvasOperations.prototype.clearField = function() {
        this.options.ctx.clearRect(0,0,this.options.width, this.options.height)
    };

    return CanvasOperations;

})();
