class Generator {
  constructor(ctx) {
    this.CONFIG = ctx.CONFIG;
    this.DEPTH = ctx.DEPTH;
    this.ctx = ctx;
    this.cols = 11;
    this.rows = 20;

    this.helper = new Helper();
    this.layers = {
      floor: [],
      walls: [],
      monsters: [],
      pickups: [],
      turrets: [],
      overlay: false,
    };

    this.frames = {
      floor: 0,
      walls: 1,
    };

    this.ty_offset = 0;
    this.px_offset = 0;

    this.height = 0;
  }

  setup() {
    this.createFloor();
    this.createRoomLayers();

    this.drawOverlay();
  }

  //update
  update() {
    this.checkNewRoom();
    this.scrollFloor();
  }

  //rooms layers
  createRoomLayers() {
    //add walls
    //...generate
    let walls = this.generateWallss();
    // //...draw
    walls = this.createWalls(walls);
    // //...append to layer
    this.layers.walls = this.layers.walls.concat(walls);

    // ***
    // add monsters
    //...generate
    if (this.CONFIG.teaching == false) {
      let monsters = this.generateMonsters();
      //...draw
      monsters = this.createMonsters(monsters);
      //...append
      this.layers.monsters = this.layers.monsters.concat(monsters);
    }

    //save total height of all the rooms
    this.saveHeight();
  }

  checkNewRoom() {
    //has the camera reached the bottom of the room?
    if (
      this.ctx.cameras.main.scrollY + this.ctx.cameras.main.height <
      this.height
    ) {
      return;
    }
    //calculate y-offsets
    this.ty_offset = Math.floor(
      this.ctx.cameras.main.scrollY / this.CONFIG.tile
    );
    this.px_offset = this.ctx.cameras.main.scrollY;
    //destroy rows that have passed
    this.destroyPassedRows();
    //append new room
    this.createRoomLayers();
  }

  destroyPassedRows() {
    // console.log("aaa");
    let row_num = Math.floor(this.px_offset / this.CONFIG.tile);

    //walls: destroy sprites
    for (let ty = 0; ty < row_num; ty++) {
      for (let tx = 0; tx < this.cols; tx++) {
        if (this.layers.walls[ty][tx].spr) {
          // console.log('bbbb');
          this.layers.walls[ty][tx].spr.destroy();
        }
      }
    }

    // ***
    //monsters
    if (this.CONFIG.teaching == false) {
      for (let i = this.layers.monsters.length - 1; i >= 0; i--) {
        if (this.layers.monsters[i].y <= this.ctx.cameras.main.scrollY) {
          //...destroy sprite
          this.layers.monsters[i].destroy();
          //...remove monster from array
          this.layers.monsters.splice(i, 1);
        }
      }
    }
  }

  saveHeight() {
    //the total height of all the rooms
    //in other words: the bottom edge of the last room
    this.height = this.layers.walls.length * this.CONFIG.tile;
  }

  //walls layer
  generateWallss() {
    //two-dimensional array for walls
    let walls = [];

    // ***
    for (let ty = 0; ty < 1.5 * this.rows; ty++) {
      // in the very first room, the first 4 rows are empty
      //after that, create walls every 3 rows
      if (
        this.layers.walls.length + ty >= 5 &&
        (ty + 1) % 3 === 0 &&
        this.CONFIG.teaching == false
      ) {
        this.CONFIG.pauseStart = true;
        walls.push(this.generateWallRow());
      } else {
        walls.push(this.generateEmptyRow(ty));
      }
    }

    //return two-dimensional array
    return walls;
  }

  generateEmptyRow() {
    //each row is an array of tiles
    let row = [];

    //columns determine number of tiles per row
    for (let tx = 0; tx < this.cols; tx++) {
      row.push({
        tx: tx,
        is_wall: false,
      });
    }
    //return array
    return row;
  }

  generateWallRow() {
    //how many gaps?
    let gaps = [];
    for (let i = 0; i < this.helper.getRandInt(1, 2); i++) {
      //how wide are the gaps?
      gaps.push({
        idx: i,
        width: 2,
      });
    }

    //where is the first gap?
    let min = 1;
    let max = this.cols - gaps[0].width - 1;

    let tx = this.helper.getRandInt(min, max);

    gaps[0] = this.buildGap(tx, gaps[0].width);

    //where is the second gap?
    if (gaps[1]) {
      tx = this.helper.getRandInt(min, max);
      while (gaps[0].taken.indexOf(tx) >= 0) {
        tx = this.helper.getRandInt(min, max);
      }
      gaps[1] = this.buildGap(tx, gaps[1].width);
    }

    //build the row of walls with gaps
    //return array
    return this.buildRow(gaps);
  }

  buildGap(tx, width) {
    let gap = {
      tx: tx,
      width: width,
    };
    gap.empty = [];
    for (let i = 0; i < width; i++) {
      gap.empty.push(tx + i);
    }
    gap.taken = [];
    for (let i = -2; i < width + 2; i++) {
      gap.taken.push(tx + i);
    }
    return gap;
  }

  buildRow(gaps) {
    let row = [];
    //first create walls on all tiles
    for (let tx = 0; tx < this.cols; tx++) {
      row.push({
        tx: tx,
        frame: this.frames.walls,
        is_wall: true,
      });
    }
    //then delete walls where there are gaps
    gaps.forEach((el) => {
      for (let tx = el.tx; tx < el.tx + el.width; tx++) {
        if (row[tx]) {
          row[tx].is_wall = false;
        }
      }
    }, this);
    //return array
    return row;
  }

  createWalls(walls) {
    let x;
    let y;
    let spr;
    //loop each tile in the walls array...
    //...row by row
    for (let ty = 0; ty < walls.length; ty++) {
      //...col by col
      for (let tx = 0; tx < walls[ty].length; tx++) {
        //pixel pos of the wall sprite
        x = tx * this.CONFIG.tile + this.CONFIG.map_offset;
        y = (ty + this.layers.walls.length) * this.CONFIG.tile;

        //draw only if it's a wall
        if (walls[ty][tx].is_wall) {
          spr = this.ctx.add.sprite(x, y, "tileset");
          spr.setOrigin(0);
          spr.setDepth(this.DEPTH.wall);
          spr.setFrame(walls[ty][tx].frame);

          walls[ty][tx].spr = spr;
        }
      }
    }
    return walls;
  }

  //floor layer
  createFloor() {
    let x;
    let y;
    let spr;

    // Draw bigger than camera view height
    let cols = this.cols;
    let rows = this.rows + 1;

    //save tiles in array
    let floor = [];

    //loop cols & rows
    for (let ty = 0; ty < rows; ty++) {
      floor[ty] = [];

      for (let tx = 0; tx < cols; tx++) {
        x = tx * this.CONFIG.tile + this.CONFIG.map_offset;
        y = ty * this.CONFIG.tile + this.CONFIG.map_offset;

        spr = this.ctx.add.sprite(x, y, "tileset");
        spr.setOrigin(0);
        spr.setDepth(this.DEPTH.floor);

        floor[ty][tx] = spr;
      }
    }

    // save floor array in generator layers
    this.layers.floor = floor;
  }

  scrollFloor() {
    let offset = this.ctx.cameras.main.scrollY - this.layers.floor[0][0].y;
    if (offset >= this.CONFIG.tile) {
      this.destroyFloorRow();
      this.appendFloorRow();
    }
  }

  destroyFloorRow() {
    for (let tx = 0; tx < this.layers.floor[0].length; tx++) {
      this.layers.floor[0][tx].destroy();
    }

    this.layers.floor.splice(0, 1);
  }

  appendFloorRow() {
    let x;
    let spr;

    //row at the end of the floor, right below camera edge
    let ty = this.layers.floor.length;
    let y = this.layers.floor[ty - 1][0].y + this.CONFIG.tile;

    //add empty row to the floor layer
    this.layers.floor.push([]);

    //draw tiles on this row
    for (let tx = 0; tx < this.cols; tx++) {
      x = tx * this.CONFIG.tile + this.CONFIG.map_offset;

      spr = this.ctx.add.sprite(x, y, "tileset");
      spr.setOrigin(0);
      spr.setDepth(this.DEPTH.floor);

      this.layers.floor[ty][tx] = spr;
    }
  }

  checkTileBlocked(tx, ty) {
    if (typeof tx === "object") {
      ty = tx.ty;
      tx = tx.tx;
    }

    // outside of the grid? counts as walls
    if (typeof this.layers.walls[ty] === "undefined") {
      return true;
    } else if (typeof this.layers.walls[ty][tx] === "undefined") {
      return true;
    }
    // flagged as wall?
    else {
      return this.layers.walls[ty][tx].is_wall;
    }
  }

  checkMonsterBlocked(tx, ty) {
    if (typeof tx === "object") {
      ty = tx.ty;
      tx = tx.tx;
    }
  }

  //monsters layer...
  generateMonsters() {
    //random position in the room
    let pos = this.getRandPosInRoom();
    //check tile is not a wall
    while (this.layers.walls[pos.row][pos.col].is_wall) {
      pos = this.getRandPosInRoom();
    }
    // spawn position
    let spawn = {
      tx: pos.col,
      ty: pos.row,
      x: this.CONFIG.map_offset + (pos.col + 0.5) * this.CONFIG.tile,
      y: (pos.row + 0.5) * this.CONFIG.tile,
    };
    // one monster for each room
    return [
      {
        spawn: spawn,
        key: this.getMonsterKey(),
      },
    ];
  }

  getMonsterKey() {
    let keys = ["spr-slime", "spr-spider"];
    let idx = this.helper.getRandInt(0, keys.length - 1);

    return keys[idx];
  }

  createMonsters(monsters) {
    for (let i = 0; i < monsters.length; i++) {
      monsters[i] = new Monster(
        this.ctx,
        monsters[i].spawn.x,
        monsters[i].spawn.y,
        monsters[i].key
      );
      monsters[i].setDepth(this.DEPTH.monster);
    }
    return monsters;
  }

  //overlay...
  drawOverlay() {
    let x;
    let y;
    let spr;
    let ty = 0;
    let depth = this.DEPTH.overlay;

    //array for the layer
    let overlay = [];

    //draw spike tiles on the top edge
    for (let tx = 0; tx < this.cols + 2; tx++) {
      x = tx * this.CONFIG.tile - this.CONFIG.tile + 1;
      y = ty * this.CONFIG.tile + 8;

      let spr = this.ctx.add.sprite(x, y, "tileset");
      spr.setFrame(4);
      spr.setOrigin(0);
      spr.setDepth(depth);
      spr.setScrollFactor(0);

      overlay.push(spr);
    }

    //save layer
    this.layers.overlay = overlay;
  }
  //helpers...
  getRandPosInRoom() {
    let min = {
      col: 0,
      row: Math.floor(
        (this.ctx.cameras.main.scrollY + this.ctx.cameras.main.height) /
          this.CONFIG.tile
      ),
    };

    let max = {
      col: this.cols - 1,
      row: this.layers.walls.length - 1,
    };

    let col = this.helper.getRandInt(min.col, max.col);
    let row = this.helper.getRandInt(min.row, max.row);

    return {
      col: col,
      row: row,
    };
  }
}
