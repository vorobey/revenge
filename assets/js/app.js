app = window.app || {};

$(function() {
    var field = document.getElementById('battlefield'),
        animationService, canvasService;

    //get config and then init all
    $.ajax({
        url: '../assets/files/data.json',
        isLocal: true,
        method: 'GET',
        dataType: 'json',
        success: function(res) {
            app.config = res;
            console.log('success', res)
            letsPartyStarted();
        }
    })

    function letsPartyStarted() {
        //init service for canvas operations
        canvasService = app.service = new app.basicProtos.CanvasOperations({
            field: field,
            ctx: field.getContext('2d'),
            width: field.width,
            height: field.height
        });

        //init animation service
        animationService = app.animationService = new app.basicProtos.AnimationService({
            service: canvasService
            //options
        });
        //and then run it
        animationService.run();
    }


    var count = 0;
    var countContainers = $('.count .val');


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
