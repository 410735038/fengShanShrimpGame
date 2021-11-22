class Booot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot", active: true });
  }

  init() {
    this.URL = this.sys.game.URL;
    this.CONFIG = this.sys.game.CONFIG;
    this.fonturl = "assets/fonts/Noto_Sans_TC/NotoSansTC-Bold.otf";
  }

  preload(){
    //bitmap font for PreloadScene
    //...path
    this.load.setPath(this.URL + 'assets/fonts');
    //...files
    this.load.bitmapFont('ClickPixel', 'click_0.png', 'click.xml');
    // this.loadFont("myFont", this.fonturl);
  }

  create(){
      this.scene.start('Preload');
  }
}
