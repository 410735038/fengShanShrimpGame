class Play extends Phaser.Scene {
  constructor() {
    super({ key: "Play", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;

    this.DEPTH = {
      floor: 0,
      wall: 1,
      pickup: 2,
      monster: 3,
      player: 4,
      overlay: 5,
      ui: 6,
      menu: 7,
    };

    this.helper = new Helper();
    this.generator = new Generator(this);
    //Main flags
    this.allow_input = false;
    this.is_pause = false;
    this.is_gameover = false;
    this.is_victory = false;

    //controls
    this.is_holding = {
      left: false,
      right: false,
      direction: false,
    };

    //camera
    this.cam_speed = {
      base: 1,
      current: 1,
      max: 1,
    };

    // teaching
    this.checking_left = true;
    this.checking_right = false;

    this.gloCheckL = true;
    this.gloCheckR = true;

    this.left_timer = this.time.addEvent({
      delay: 1000,
      callback: this.sparkBtn_left,
      callbackScope: this,
      loop: true,
      paused: false,
    });

    this.right_timer = this.time.addEvent({
      delay: 1000,
      callback: this.sparkBtn_right,
      callbackScope: this,
      loop: true,
      paused: true,
    });

    this.txt_start_timer = this.time.addEvent({
      delay: 1000,
      callback: this.triggerStartTitle,
      callbackScope: this,
      loop: true,
      paused: true,
    });
  }

  create() {
    //create floor
    this.generator.setup();
    this.generator.layers.monsters;
    //player
    this.createPlayer();

    //controls
    this.createControls();

    //Ui
    this.createUi();
    this.createPauseScreen();

    //start the game
    this.allow_input = true;
    this.is_pause = false;
    this.is_gameover = false;
    this.is_victory = false;

    this.gloI = 0;
  }

  update() {
    //pause? gameover?
    if (this.is_pause || this.is_gameover || this.is_victory) return;

    // Camera moves down
    this.updateCamera();
    // Draw new floor tiles
    // Delete passed floor tiles
    this.generator.update();

    //update player
    this.player.update(this.is_holding.direction);

    //user interface
    this.score = this.player.ty;
    this.shrimp_score = this.player.shrimp_score;
    this.updateUi();

    if (this.checking_left == true) {
      this.left_timer.paused = false;
      this.checking_left = false;
    }

    if (this.checking_right == true) {
      this.right_timer.paused = false;
      this.checking_right = false;
    }

    if (this.CONFIG.pauseStart == true) {
      this.txt_start_timer.paused = true;
      this.txt_START.setVisible(false);
    }

    //check gameover
    if (this.player.states.dead) {
      this.triggerGameOver();
      return;
    }

    if (this.player.states.victory) {
      this.triggerVictory();
      return;
    }
  }

  //player
  createPlayer() {
    let center = this.helper.getTileCenter(5, 1, this.CONFIG.tile);

    this.player = new Playerr(
      this,
      //   this.CONFIG.centerX,
      //   this.CONFIG.centerY,
      center.x,
      this.CONFIG.width,
      "spr-hero"
    );

    // console.log(this.player.health.total);

    this.player.setDepth(this.DEPTH.player);

    this.player.startMoving();

    // this.player.createSprite();
  }

  // gameover
  triggerGameOver() {
    if (this.is_gameover) return;
    //flag
    this.is_gameover = true;

    //shake screen
    //...

    //timeout: go menu
    this.time.addEvent({
      delay: 1500,
      callback: this.showGameOver,
      callbackScope: this,
    });
  }

  triggerVictory() {
    if (this.is_victory) return;
    //flag
    this.is_victory = true;

    //timeout: can go next webpage
    this.time.addEvent({
      delay: 1500,
      callback: this.showVictory,
      callbackScope: this,
    });
  }

  showGameOver() {
    console.log("gameover!");
    //hide certain elements in the UI...
    //...pause
    this.btn_pause.setVisible(false);
    //...score
    this.txt_score.setVisible(false);
    //...shrimp
    this.txt_shrimp_score.setVisible(false);

    //show the game over scene as overlay
    this.scene.launch("GameOver", { score: this.score, depth: this.DEPTH });
    let panel = this.scene.get("GameOver");
    // listen to events from the game over scene
    panel.events.on("clickMenu", this.handleGoMenu, this);
    panel.events.on("clickTryAgain", this.handleTryAgain, this);
  }

  closeGameOver() {
    this.scene.stop("GameOver");
    this.btn_pause.setVisible(false);
    this.txt_score.setVisible(false);
  }

  handleGoMenu() {
    this.closeGameOver();
    this.goMenu();
  }

  handleTryAgain() {
    this.closeGameOver();
    this.restartGame();
  }

  showVictory() {
    console.log("victory!");
    this.btn_pause.setVisible(false);
    this.txt_score.setVisible(false);
    this.txt_shrimp_score.setVisible(false);

    this.scene.launch("Victory", {
      shrimp_score: this.shrimp_score,
      score: this.score,
      depth: this.DEPTH,
    });
    let panel = this.scene.get("Victory");
    // listen to events from the game over scene
    panel.events.on("clickNextLevel", this.handleGoNextLevel, this);
    panel.events.on("clickTryAgain", this.handleTryAgain_vic, this);
  }

  closeVictory() {
    this.scene.stop("Victory");
    this.btn_pause.setVisible(false);
    this.txt_score.setVisible(false);
  }

  handleGoNextLevel() {
    let url = "https://www.google.com/";

    //share
    this.helper.openURL(url);
  }

  handleTryAgain_vic() {
    this.closeVictory();
    this.restartGame();
  }

  // camera
  updateCamera() {
    this.cameras.main.setScroll(
      0,
      this.cameras.main.scrollY + this.cam_speed.current
    );

    //keep up with the player if he has reached the center of the screen
    let centerY = this.cameras.main.scrollY + 0.5 * this.cameras.main.height;

    if (this.player.y >= centerY) {
      this.cameras.main.setScroll(
        0,
        this.player.y - 0.5 * this.cameras.main.height
      );
    }
  }

  setCamSpeed(speed) {
    this.cam_speed.base = speed;
    this.cam_speed.current = speed;
    this.cam_speed.current = Math.min(
      this.cam_speed.current,
      this.cam_speed.max
    );
    this.cam_speed.current = Math.max(this.cam_speed.current, 0);
  }

  //controls
  createControls() {
    // create zones for input
    let w = 0.45 * this.CONFIG.width;
    let h = this.CONFIG.height;

    this.zone_left = this.add.zone(0, 0, w, h);
    this.zone_left.setOrigin(0, 0);
    this.zone_left.setDepth(this.DEPTH.ui);
    this.zone_left.setScrollFactor(0);

    this.zone_right = this.add.zone(this.CONFIG.width, 0, w, h);
    this.zone_right.setOrigin(1, 0);
    this.zone_right.setDepth(this.DEPTH.ui);
    this.zone_right.setScrollFactor(0);

    // add input callbacks
    this.zone_left.setInteractive();
    this.zone_left.on("pointerdown", this.holdLeft, this);
    this.zone_left.on("pointerup", this.releaseLeft, this);
    this.zone_left.on("pointerout", this.releaseLeft, this);

    this.zone_right.setInteractive();
    this.zone_right.on("pointerdown", this.holdRight, this);
    this.zone_right.on("pointerup", this.releaseRight, this);
    this.zone_right.on("pointerout", this.releaseRight, this);
  }

  holdLeft() {
    if (!this.allow_input) return;
    if (this.is_pause || this.is_gameover) return;
    this.is_holding.left = true;
    this.is_holding.direction = "left";
    this.checkLeft();
  }

  checkLeft() {
    if (this.gloI == 0) {
      this.checking_right = true;
      this.left_timer.paused = true;
      this.left_check.setVisible(false);
      this.txt_checkleft.setVisible(false);
      this.gloI++;
    } else return;
  }

  holdRight() {
    if (!this.allow_input) return;
    if (this.is_pause || this.is_gameover) return;
    this.checkRight();
    this.startTitle();
    // this.check_right = false;
    this.is_holding.right = true;
    this.is_holding.direction = "right";
  }

  checkRight() {
    if (this.gloI == 1) {
      this.check_right = false;
      this.right_timer.paused = true;
      this.right_check.setVisible(false);
      this.txt_checkright.setVisible(false);
      this.gloI++;
      this.CONFIG.teaching = false;
    } else return;
  }

  startTitle() {
    if (this.gloI == 2) {
      this.txt_start_timer.paused = false;
    }
  }

  triggerStartTitle() {
    this.txt_START.setVisible(this.gloCheckL);
    this.gloCheckL = !this.gloCheckL;
  }

  releaseLeft() {
    this.is_holding.left = false;
    if (this.is_holding.right) {
      this.is_holding.direction = "right";
    } else {
      this.is_holding.direction = false;
    }
  }

  releaseRight() {
    this.is_holding.right = false;
    if (this.is_holding.left) {
      this.is_holding.direction = "left";
    } else {
      this.is_holding.direction = false;
    }
  }

  //Ui
  createUi() {
    //bkg
    //... top bar
    this.bg_top = this.createUiBar(0, 0);
    //...bot bar
    this.bg_bot = this.createUiBar(0, this.CONFIG.height - this.CONFIG.tile);
    //leftcheck/rightcheck
    this.left_check = this.createCheckZone(
      this.CONFIG.width / 2 - 150,
      this.CONFIG.height / 2 - this.CONFIG.tile
    );
    this.left_check.setVisible(false);

    this.right_check = this.createCheckZone(
      this.CONFIG.width / 2 + 50,
      this.CONFIG.height / 2 - this.CONFIG.tile
    );
    this.right_check.setVisible(false);

    //pause button
    this.btn_pause = new Button(this, 32, 32, "btn-pause", this.clickPause);
    // this.btn_pause = this.add.sprite(32, 32, 'btn-pause');
    this.btn_pause.setDepth(this.DEPTH.menu);
    this.btn_pause.setScrollFactor(0);
    this.btn_pause.setScale(2);
    //Health hearts
    // let icn;
    // let x = Math.round(this.btn_pause.getTopRight().x + 2.5 * this.CONFIG.tile);
    // let y = this.bg_top.getData("centerY");
    // let step = Math.round(1.5 * this.CONFIG.tile);

    // this.arr_hearts = [];

    // for (let i = 0; i < this.player.health.total; i++) {
    //   icn = this.add.sprite(x + i * step, y, "spr-icons");

    //   icn.setDepth(this.DEPTH.ui);
    //   icn.setScrollFactor(0);
    //   icn.setFrame(0);

    //   this.arr_hearts.push(icn);
    // }
    //distance score
    this.txt_score = new Textt(
      this,
      this.bg_bot.getData("centerX"),
      this.bg_bot.getData("centerY"),
      "Distance: 0",
      "score"
    );

    this.txt_shrimp_score = new Textt(
      this,
      this.bg_top.getData("centerX"),
      this.bg_top.getData("centerY"),
      "Shrimp: 0",
      "score"
    );

    this.txt_checkleft = new Textt(
      this,
      this.left_check.getData("centerX"),
      this.left_check.getData("centerY"),
      "click Left",
      "score"
    );

    this.txt_checkright = new Textt(
      this,
      this.right_check.getData("centerX"),
      this.right_check.getData("centerY"),
      "click Right",
      "score"
    );

    this.txt_START = new Textt(
      this,
      this.CONFIG.width / 2,
      this.CONFIG.height / 2,
      "START!!",
      "preload"
    );

    this.txt_score.setDepth(this.DEPTH.ui);
    this.txt_score.setScrollFactor(0);
    this.txt_shrimp_score.setDepth(this.DEPTH.ui);
    this.txt_shrimp_score.setScrollFactor(0);
    this.txt_START.setDepth(this.DEPTH.ui);
    this.txt_START.setScrollFactor(0);
    this.txt_START.setVisible(false);

    this.txt_checkleft.setDepth(this.DEPTH.ui);
    this.txt_checkleft.setScrollFactor(0);
    this.txt_checkleft.setVisible(false);

    this.txt_checkright.setDepth(this.DEPTH.ui);
    this.txt_checkright.setScrollFactor(0);
    this.txt_checkright.setVisible(false);
  }

  createUiBar(x, y) {
    let w = this.CONFIG.width;
    let h = this.CONFIG.tile + 5;

    let bar = this.add.graphics({ x: x, y: y });

    bar.fillStyle("0x314edd", 1);
    bar.fillRect(0, 0, w, h + 3);
    bar.setDepth(this.DEPTH.ui);
    bar.setScrollFactor(0);

    bar.setDataEnabled();
    bar.setData("centerX", x + 0.5 * w);
    bar.setData("centerY", y + 0.5 * h);
    return bar;
  }

  createCheckZone(x, y) {
    let w = 100;
    let h = this.CONFIG.tile + 5;

    let bar = this.add.graphics({ x: x, y: y });

    bar.fillStyle("0x314edd", 1);
    bar.fillRect(0, 0, w, h + 3);
    bar.setDepth(this.DEPTH.ui);
    bar.setScrollFactor(0);

    bar.setDataEnabled();
    bar.setData("centerX", x + 0.5 * w);
    bar.setData("centerY", y + 0.5 * h);
    return bar;
  }

  updateUi() {
    if (!this.player) return;
    //update score to player distance
    this.txt_score.setText("Distance: " + this.score);
    this.txt_shrimp_score.setText("Shrimp: " + this.shrimp_score);

    //update hearts to player health
    // let i = 0;
    // this.arr_hearts.forEach((el) => {
    //   i++;
    //   // ...full heart
    //   if (i <= this.player.health.current) {
    //     el.setFrame(0);
    //   }
    //   //...empty heart
    //   else {
    //     el.setFrame(1);
    //   }
    // });
  }

  //per sec clickbtn
  sparkBtn_left() {
    this.txt_checkleft.setVisible(this.gloCheckL);
    this.left_check.setVisible(this.gloCheckL);
    this.gloCheckL = !this.gloCheckL;
  }

  sparkBtn_right() {
    this.txt_checkright.setVisible(this.gloCheckR);
    this.right_check.setVisible(this.gloCheckR);
    this.gloCheckR = !this.gloCheckR;
  }

  //pause...
  createPauseScreen() {
    //transparent dark veil
    this.veil = this.add.graphics({ x: 0, y: 0 });
    this.veil.fillStyle("0x000000", 0.3);
    this.veil.fillRect(0, 0, this.CONFIG.width, this.CONFIG.height);
    this.veil.setDepth(this.DEPTH.ui);
    this.veil.setScrollFactor(0);
    //pause text
    this.txt_pause = new Textt(
      this,
      this.CONFIG.centerX,
      this.CONFIG.centerY - 32,
      "Pause",
      "title"
    );
    this.txt_pause.setDepth(this.DEPTH.ui);
    this.txt_pause.setScrollFactor(0);
    //hide at start
    this.togglePauseScreeen(false);
  }

  togglePauseScreeen(is_visible) {
    this.veil.setVisible(is_visible);
    this.txt_pause.setVisible(is_visible);
  }

  //pause...
  clickPause() {
    if (!this.allow_input) return;
    if (this.is_gameover) return;

    //flag
    this.is_pause = !this.is_pause;
    //toggle pause overlay
    this.togglePauseScreeen(this.is_pause);
    //pause
    if (this.is_pause) {
      this.startPause();
    } else {
      this.endPause();
    }
  }

  startPause() {
    //stop player walk anim
    if (this.player.states.walk) {
      this.player.stopMoving();
    }
  }

  endPause() {
    //resume player walk anim
    if (this.player.states.idle) {
      this.player.startMoving();
    }
  }

  //scenes
  goMenu() {
    this.scene.start("Menu");
  }

  restartGame() {
    this.CONFIG.pauseStart = false;
    this.CONFIG.teaching = true;
    this.scene.restart();
  }
}
