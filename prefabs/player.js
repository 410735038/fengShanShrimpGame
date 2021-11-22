class Playerr extends Entityy {
  constructor(ctx, x, y, key) {
    super(ctx, x, y, key); // call parent constructor entity

    this.helper = new Helper();

    //movement
    this.speed = {
      base: 2,
      current: 2,
      max: 6,
    };

    this.shrimp_score = 0;
  }

  update(is_holding) {
    if (this.states.dead) return;

    //save the current direction
    this.setCurrentDirection(is_holding);

    //are we walking?
    if (this.states.walk) {
      this.updateSpriteDirection();
      this.moveSprite();
      this.handleCollisionWithMonsters();
    }

    // have we died because we are too slow?
    this.checkScrollDeath();
    this.checkIsVictory();
  }

  //gamePlay
  checkScrollDeath() {
    if (this.states.dead) return;
    if (
      this.getTopY() <=
      Math.round(this.ctx.cameras.main.scrollY + 0.75 * this.TILE_SIZE)
    ) {
      this.die();
    }
  }

  die() {
    if (this.states.dead) return;
    this.checkScrollDeath.current = 0;
    this.setState("dead");
    this.startNewAnim("dead");
  }

  checkIsVictory(){
      if(this.states.victory) return;
      if(this.shrimp_score === 10){
          this.victory();
      }
  }

  victory(){
      if(this.states.victory) return;
      this.setState("victory");
  }

  //movement
  startMoving() {
    this.setState("walk");
    this.startNewAnim("walk");
  }

  stopMoving() {
    this.setState("idle");
    this.startNewAnim("idle");
  }

  moveSprite() {
     switch (this.direction.current) {
      case "down":
        this.moveDown();
        break;
      case "left":
        this.moveLeft();
        break;
      case "right":
        this.moveRight();
        break;
    }
  }

  moveDown() {
    this.y += this.speed.current;
    this.handleCollision("down");
    this.setSpritePos();
  }

  moveLeft() {
    this.x -= this.speed.current;
    this.handleCollision("left");
    this.setSpritePos();
  }

  moveRight() {
    this.x += this.speed.current;
    this.handleCollision("right");
    this.setSpritePos();
  }

  handleCollision(direction) {
    let tile1;
    let tile2;
    let now;
    let corr;
    //check wall tiles in player's direction
    switch (direction) {
      case "down":
        tile1 = this.getBottomLeftTile();
        tile2 = this.getBottomRightTile();
        now = this.helper.convertPxToTile(
          this.x,
          this.getBottomY(),
          this.TILE_SIZE
        );
        corr = {
          x: this.x,
          y: this.helper.getTileCenter(now.tx, now.ty - 1, this.TILE_SIZE).y,
        };
        break;
      case "left":
        tile1 = this.getTopLeftTile();
        tile2 = this.getBottomLeftTile();
        now = this.helper.convertPxToTile(
          this.getLeftX(),
          this.y,
          this.TILE_SIZE
        );
        corr = {
          x: this.x,
          y: this.helper.getTileCenter(now.tx, now.ty - 1, this.TILE_SIZE).y,
        };
        break;
      case "right":
        tile1 = this.getTopRightTile();
        tile2 = this.getBottomRightTile();
        now = this.helper.convertPxToTile(
          this.getRightX(),
          this.y,
          this.TILE_SIZE
        );
        corr = {
          x: this.x,
          y: this.helper.getTileCenter(now.tx, now.ty - 1, this.TILE_SIZE).y,
        };
        break;
    }
    //check if the player collides with a wall
    let is_tile1_wall = this.ctx.generator.checkTileBlocked(tile1);
    let is_tile2_wall = this.ctx.generator.checkTileBlocked(tile2);

    if (is_tile1_wall || is_tile2_wall) {
      this.x = corr.x;
      this.y = corr.y;
    }
  }

  handleCollisionWithMonsters() {
    for(let i = 0; i <　this.ctx.generator.layers.monsters.length; i++){
      if((this.x >= this.ctx.generator.layers.monsters[i].x - 0.5 * this.ctx.generator.layers.monsters[i].width  
        && this.x <= this.ctx.generator.layers.monsters[i].x + 0.5 * this.ctx.generator.layers.monsters[i].width)
          && (this.y >= this.ctx.generator.layers.monsters[i].y - 0.5 * this.ctx.generator.layers.monsters[i].width  
            && this.y <= this.ctx.generator.layers.monsters[i].y + 0.5 * this.ctx.generator.layers.monsters[i].height))
      {
          console.log('aaaaaaaa')
          this.ctx.generator.layers.monsters[i].destroy();
          this.ctx.generator.layers.monsters.splice(i, 1);
          this.shrimp_score += 10;
      }
    }
  }

  //setters
  setCurrentDirection(is_holding) {
    if (is_holding) {
      this.direction.current = is_holding;
    } else {
      this.direction.current = "down";
    }
  }
}
