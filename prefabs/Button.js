class Button{
    constructor(ctx, x, y, key, callback, string){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.key = key;

        this.width;
        this.height;

        this.callback = callback;
        this.text = string;

        this.frames = {
            out : 0,
            over : 1,
            down : 2
        };

        this.origin = this.initOrigin();
        this.obj = this.initObjects();
    }

    //init..
    initOrigin(origin){
        //same origin for both x & y
        if(typeof origin === 'number'){
            return{
                x : origin,
                y : origin
            }
        }
        // different origin for both x & y
        else if(typeof origin === 'object')
        {
            return origin;
        }
        //default : center origin
        else{
            return {x:0.5, y : 0.5};
        }
    }

    initObjects(){
        //button sprite
        let btn = this.createSprite();
        this.width = btn.displayWidth;
        this.height = btn.displayHeight;

        //label text
        let lbl = false;
        if(typeof this.text === 'string'){
            lbl = new Textt(this.ctx, btn.getCenter().x, btn.getCenter().y, this.text);
        }
        //return phaser objects
        return{
            btn : btn,
            lbl: lbl
        }
    }

    createSprite(){
        // phaser 3 sprite object
        let spr = this.ctx.add.sprite(this.x, this.y, this.key);
        spr.setOrigin(this.origin.x, this.origin.y);

        //callback handlers
        spr.setInteractive();

        spr.on('pointerout', this.handleOut, this);
        spr.on('pointerover', this.handleOver, this);
        spr.on('pointerdown', this.handleDown, this);
        spr.on('pointerup', this.handleUp, this);

        //return phaser sprite
        return spr;
    }

    destroy(){
        if(this.obj.btn) this.obj.btn.destroy();
        if(this.obj.lbl) this.obj.lbl.destroy();

        this.obj = {};
    }

    //callback handlers
    handleOut(){
        this.obj.btn.setFrame(this.frames.out);
    }

    handleOver(){
        this.obj.btn.setFrame(this.frames.over);
    }

    handleDown(){
        this.obj.btn.setFrame(this.frames.down);
    }

    handleUp(){
        this.obj.btn.setFrame(this.frames.up);

        this.callback.call(this.ctx);
    }

    //setters
    setDepth(depth){
        this.obj.btn.setDepth(depth);
        if(this.obj.lbl)
        {
            this.obj.lbl.setDepth(depth);
        }
    }

    setScrollFactor(scrollX, scrollY){
        this.obj.btn.setScrollFactor(scrollX, scrollY);
        if(this.obj.lbl){
            this.obj.lbl.setScrollFactor(scrollX, scrollY);
        }
    }

    setScale(scaleX, scaleY){
        this.obj.btn.setScale(scaleX, scaleY);
        if(this.obj.lbl){
            this.obj.lbl.setScale(scaleX, scaleY);
        }
        this.width = this.obj.btn.displayWidth;
        this.height = this.obj.btn.displayHeight;
    }

    setText(string){
        if(this.obj.lbl){
            this.text = string;
            this.obj.lbl.setText(string);
        }
    }

    setX(x){
        this.x = x;
        this.obj.btn.setX(x);
        if(this.obj.lbl){
            this.obj.lbl.setX(this.obj.btn.getCenter().x);
        }
    }

    setY(y){
        this.y = y;
        this.obj.btn.setY(y);
        if(this.obj.lbl){
            this.obj.lbl.setY(this.obj.btn.getCenter().y);
        }
    }

    setWidth(width){
        this.obj.btn.setDisplaySize(width, this.height);
        this.width = width;
    }

    setHeight(height){
        this.obj.btn.setDisplaySize(this.width, height);
        this.height = height;
    }

    setAlpha(alpha){
        this.obj.btn.setAlpha(alpha);
        if(this.obj.lbl){
            this.obj.lbl.setAlpha(alpha);
        }
    }

    setVisible(is_visible){
        this.obj.btn.setVisible(is_visible);
        if(this.obj.lbl){
            this.obj.lbl.setVisible(is_visible);
        }
    }

    //getters
    getCenter(){
        return this.obj.btn.getCenter();
    }

    getTopLeft(){
        return this.obj.btn.getTopLeft();
    }

    getTopRight(){
        return this.obj.btn.getTopRight();
    }

    getBottomLeft(){
        return this.obj.btn.getBottomLeft();
    }

    getBottomRight(){
        return this.obj.btn.getBottomRight();
    }
}
