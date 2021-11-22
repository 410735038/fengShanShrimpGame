class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload", active: false });
  }

  init() {
    //globals
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
  }

  preload() {
    //create loading bar
    this.createLoadingBar();


    //images
    // ...path
    this.load.setPath(this.URL + 'assets/img');
    // ...files
    //spritesheets
    //...path
    this.load.setPath(this.URL + "assets/img");
    //files
    this.load.spritesheet("tileset", "tile.png", {frameWidth: 32,frameHeight: 32,endFrame: 19,margin: 0,spacing: 0,});
    this.load.spritesheet("spr-hero", "player.png", {frameWidth: 32,frameHeight: 32,endFrame: 3,margin: 0,spacing: 4,});
    this.load.spritesheet("spr-slime", "shrimp.png", {frameWidth: 32,frameHeight: 32,endFrame: 4,margin: 2,spacing: 4,});

    this.load.spritesheet("btn-pause", "btn-pause.png", {frameWidth: 32,frameHeight: 32,endFrame: 2,margin: 0,spacing: 0});

    this.load.image('frontMenu', "front cover.png");
    this.load.image('again txt', "again txt.PNG");;
    this.load.image('back menu txt', "back menu txt.PNG");
    this.load.image('next level txt', "next level txt.PNG");
  }

  create() {
    this.fc = this.add.tileSprite(180,320,360,640,'frontMenu');
    // create sprite animations
    this.createAllAnims();

    //go menu
    this.time.addEvent({
      delay: 1000,
      callback: function () {
        this.scene.start("Menu");
      },
      callbackScope: this,
    });
    // this.scene.start('Menu');
  }

  createLoadingBar() {
    //title
    this.title = new Textt(
      this,
      this.CONFIG.centerX,
      75,
      "Loading Game",
      "preload",
      0.5
    );

    //progress text
    this.txt_progress = new Textt(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY - 5,
      "Loading...",
      "preload",
      { x: 0.5, y: 1 }
    );

    //progress bar
    //...
    let x = 10;
    let y = this.CONFIG.centerY + 5;

    this.progress = this.add.graphics({ x: x, y: y });
    this.border = this.add.graphics({ x: x, y: y });
    //progress callback
    this.load.on("progress", this.onProgress, this);
  }

  onProgress(val) {
    //width of bar
    //...
    let w = this.CONFIG.width - 2 * this.progress.x;
    let h = 36;
    this.progress.clear();
    this.progress.fillStyle("0xFFFFFF", 1);
    this.progress.fillRect(0, 0, w * val, h);

    this.border.clear();
    this.border.lineStyle(4, "0x4D6592", 1);
    this.border.strokeRect(0, 0, w * val, h);

    //percentage in progress text
    this.txt_progress.setText(Math.round(val * 100) + "%");
    console.log(this.txt_progress.text);
  }

  createAllAnims() {
    //hero walking
    this.anims.create({
      key: "spr-hero-walk",
      frames: this.anims.generateFrameNames("spr-hero", {
        frames: [0, 0, 1, 1],
      }),
      repeat: -1,
      frameRage: 12,
    });
  }
}
