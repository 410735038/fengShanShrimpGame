const resizeApp = function() {
    'use strict';

    //width-height-ratio of game resolution
    let game_ratio = 360 / 640;

    //make div full height of browser and keep the ratio of game resolution
    let div = document.getElementById('phaser-app');
    div.style.width = (window.innerHeight * game_ratio) + 'px';
    div.style.height = window.innerHeight + 'px';

    //check if device DPI messes up the width-height-ratio
    let canvas = document.getElementsByTagName('canvas')[0];

    let dpi_w = (parseInt(div.style.width) / canvas.width);
    let dpi_h = (parseInt(div.style.height) / canvas.height);

    let height = window.innerHeight * (dpi_w / dpi_h);
    let width = height * game_ratio;

    //scale canvas
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

const runApp = function() {
    'use strict';

    //init the phaser game app
    let app = new App();
    app.start();

    //scale to device
    window.addEventListener('resize', resizeApp);
    resizeApp();
}

window.onload = function() {
    'use strict';

    //check es6
    try{
        eval('let i = 0;');
        eval('const _dev = true');
    }
    catch(e){
        alert('This browser is not supported. Use Chrome or Firefox');
        return false;
    }

    //launch the game
    runApp();
}