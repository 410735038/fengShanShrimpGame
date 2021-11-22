class Entityy {
  constructor(ctx, x, y, key) {
    this.MAP_OFFSET = ctx.CONFIG.map_offset;
    this.TILE_SIZE = ctx.CONFIG.tile;

    this.helper = new Helper();
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.depth = 0;

    this.key = key;
    this.frames = {
      idle: 0,
      hurt: 3,
    };

    this.states = {
      idle: true,
      walk: false,
      hurt: false,
      dead: false,
      last: false,
      victory: false
    };

    this.direction = {
      last: false,
      current: "down",
    };

    this.health = {
      total: 1,
      current: 1,
    };

    this.speed = {
      base: 0,
      current: 0,
      max: 0,
    };

    //tile position
    this.setTilePos();
    //shadow
    this.createShadow();
    //sprite
    this.createSprite();
  }

  //sprite
  createSprite() {
    if (this.spr) {
      this.spr.destroy();
    }
    this.spr = this.ctx.add.sprite(this.x, this.y, this.key);
    this.spr.setOrigin(0.5);
  }

  destroy() {
    if (this.spr) {
      this.spr.destroy();
    }

    this.destroyShadow();

    this.spr = false;
  }

  updateSpriteDirection() {
    switch (this.direction.current) {
      case "left":
        this.spr.setAngle(90);
        break;
      case "right":
        this.spr.setAngle(-90);
        break;
      case "up":
        this.spr.setAngle(180);
        break;
      //down
      default:
        this.spr.setAngle(0);
    }
  }

  //shadow
  createShadow() {
    this.shadow = this.ctx.add.graphics({ x: this.x, y: this.y });

    let alpha = 0.1;
    let radius = 10;

    this.shadow.fillStyle("0x000000", alpha);
    this.shadow.fillCircle(0, 0, radius);
  }

  destroyShadow() {
    if (this.shadow) {
      this.shadow.destroy();
    }

    this.shadow = false;
  }

  //animations
  startNewAnim(key) {
    this.stopAnim();
    switch (key) {
      case "idle":
        this.startIdleAnim();
        break;
      case "walk":
        this.startWalkAnim();
        break;
      case "dead":
      case "hurt":
        this.startHurtAnim();
        break;
      default:
        console.log(this.key + "invalid anim key", key);
    }
  }

  startIdleAnim() {
    this.spr.setFrame(this.frames.idle);
  }

  startWalkAnim() {
    this.spr.play(this.key + "-walk");
  }

  startHurtAnim() {
    this.spr.setFrame(this.frames.hurt);
  }

  stopAnim() {
    this.spr.anims.stop();
    this.spr.setFrame(this.frames.idle);
  }

  //setters
  setSpritePos(x, y) {
    if (typeof x === "number") this.x = x;
    if (typeof y === "number") this.y = y;

    this.spr.setX(this.x);
    this.spr.setY(this.y);

    if (this.shadow) {
      this.shadow.setX(this.x);
      this.shadow.setY(this.y);
    }

    this.setTilePos();
  }

  setTilePos(){
      let tile = this.helper.convertPxToTile(
        this.x, this.y, this.TILE_SIZE
      );

      this.tx = tile.tx;
      this.ty = tile.ty;
  }

  setDepth(depth) {
    this.depth = depth;
    this.spr.setDepth(depth);
    if (this.shadow) this.shadow.setDepth(depth);
  }

  setState(key) {
    if (!this.states.hasOwnProperty(key)) {
      console.log(this.key + " invalid STATE key: " + key);
      return;
    }

    if (this.states.last === key) {
      return;
    }

    this.resetStates();
    this.states[key] = true;
    this.states.last = key;
  }

  resetStates() {
    for (let key in this.states) {
      this.states[key] = false;
    }
  }

//    setHealth(current, total){
//       if(typeof total ==='number'){
//           this.health.total = total;
//       }

//       this.health.current = Math.min(current, this.health.total);
//   } 

  //getters
  getLeftX() {
    return this.x - 0.5 * this.width;
  }

  getRightX() {
    return this.x + 0.5 * this.width;
  }

  getBottomY() {
    return this.y + 0.5 * this.height;
  }

  getTopY(){
      return this.y - 0.5 * this.height;
  }

  getCenter() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getTilePos() {
    return {
      tx: this.tx,
      ty: this.ty,
    };
  }

  getTopLeftTile() {
    let x = this.getLeftX() - this.MAP_OFFSET;
    let y = this.getTopY();

    let tx = Math.floor(x / this.TILE_SIZE);
    let ty = Math.floor(y / this.TILE_SIZE);

    return {
      tx: tx,
      ty: ty,
    };
  }

  getBottomLeftTile() {
    let x = this.getLeftX() - this.MAP_OFFSET;
    let y = this.getBottomY();

    y--;

    let tx = Math.floor(x / this.TILE_SIZE);
    let ty = Math.floor(y / this.TILE_SIZE);

    return {
      tx: tx,
      ty: ty,
    };
  }

  getBottomRightTile(){
    let x = this.getRightX() - this.MAP_OFFSET;
    let y = this.getBottomY();

    x--;
    y--;

    let tx = Math.floor(x / this.TILE_SIZE);
    let ty = Math.floor(y / this.TILE_SIZE);

    return {
      tx: tx,
      ty: ty,
    };
  }

  getTopRightTile(){
    let x = this.getRightX() - this.MAP_OFFSET;
    let y = this.getTopY();

    x--;

    let tx = Math.floor(x / this.TILE_SIZE);
    let ty = Math.floor(y / this.TILE_SIZE);

    return {
      tx: tx,
      ty: ty,
    };
  }
}
