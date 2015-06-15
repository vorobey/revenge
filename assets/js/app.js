app = window.app || {};

$(function() {
    //get canvas DOM-object and init service for canvas operations
    var field = document.getElementById('battlefield');
    var canvasService = app.service = new app.basicProtos.CanvasOperations({
        field: field,
        ctx: field.getContext('2d'),
        width: field.width,
        height: field.height
    });

    var count = 0;
    var countContainers = $('.count .val');

    //init animation service
    var animationService = app.animationService = new app.basicProtos.AnimationService({
        service: canvasService
        //options
    });
    animationService.run();

    document.addEventListener('fail', function(e) {
        $('body').addClass('fail');
    }, false)

    document.addEventListener('win', function(e) {
        $('body').addClass('win');
    }, false)

    document.addEventListener('killTheEnemy', function(e) {
        countContainers.text(++count);
    }, false)

    document.addEventListener('updateFPS', function(e) {
        $('.fps-count .val').text(e.detail.value);
    }, false)


    // music management
    audio = document.getElementById("audio");
    // audio.addEventListener("playing", drawGradient, false);
    // audio.addEventListener("pause", stop, false);
    // audio.addEventListener("ended", stop, false);

    $('.again .btn').on('click', function(e) {
        count = 0;
        countContainers.text(0);
        animationService.reinit();
        animationService.run();
        $('body').removeClass();
    })

});
