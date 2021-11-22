class Menuu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;
  }

  preload() {}

  create() {
    // Background
    this.createBackground();
    // click to play text

    this.text = new Textt(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY,
      "click to play",
      "preload"
      // { x: 0.5, y: 1 }
    );

    //create mouse input
    this.createMouseInput();
    //create keyboard input
    this.createKeyboardInput();
  }

  createBackground(){
      this.fc = this.add.tileSprite(180,320,360,640,'frontMenu');
  }

  createMouseInput() {
    this.input.on("pointerup", this.goPlay, this);
  }

  createKeyboardInput() {
    function handleKeyUp(e) {
      switch (e.code) {
        case "Enter":
          this.goPlay();
          break;
      }
    }
    this.input.keyboard.on("keyup", handleKeyUp, this);
  }

  goPlay() {
    this.scene.start("Play");
  }
}
