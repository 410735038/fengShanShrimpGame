const App = function() {
  "use strict";

  this.VERSION = "0.0.1";
  this.IS_DEV = true;
};

App.prototype.start = function() {
  "use strict";

  //scenes
  let scenes = [];

  scenes.push(Booot);
  scenes.push(Preload);
  scenes.push(Menuu);
  scenes.push(Play);
  scenes.push(GameOver);
  scenes.push(Victory);

  //game config
  const config = {
    type: Phaser.AUTO,
    parent: "phaser-app",
    title: "Shrimp fenshan",
    url: "http://localhost:5500/",
    width: 360,
    height: 640,
    scene: scenes,
    //here has a url in episode 1
    pixelArt: true,
    backgroundColor: 0x000000
  };

  //create game app
  let game = new Phaser.Game(config);

  //globals
  game.IS_DEV = this.IS_DEV;
  game.VERSION = this.VERSION;

  game.URL = '';

  game.CONFIG = {
      width : config.width,
      height : config.height,
      centerX : Math.round(0.5 * config.width),
      centerY : Math.round(0.5 * config.height),
      tile : 32,
      map_offset: 4,
      teaching : true,
      pauseStart : false
    //   fps : 60
  };

  //sound
  game.SOUND_on = true;
};
