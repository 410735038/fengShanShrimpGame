class Victory extends Phaser.Scene{
    constructor(){
        super({key: 'Victory', active: false});
    }

    init(data){
        this.shrimp_score = data.shrimp_score;
        this.score = data.score;

        //constants
        this.CONFIG = this.sys.game.CONFIG;
        //prefabs
        this.helper = new Helper();
    }

    create(){
        //bkg
        let x = this.CONFIG.tile;
        let w = this.CONFIG.width - 2*x;

        let h = 296;
        let y = 148;
        this.background = this.add.graphics({x:x, y:y});
        this.background.fillStyle('0x302C2E', 1);
        this.background.fillRoundedRect(0, 0, w, h, 15);

        this.title = new Textt(
            this, x + 0.5 * w, 207, 'Victory', 'title'
        );
        //score text
        this.txt_shrimpscore = new Textt(
            this, x + 0.5 * w, y + 0.5 * h, 'Shrimp: ' + this.shrimp_score, 'standard'
        );
        this.txt_score = new Textt(
            this, x + 0.5 * w, y + 0.6 * h, 'Distance: ' + this.score, 'standard'
        );

        this.createAllButtons(x, y, w, h); 
    }

    createAllButtons(x, y, w, h){
        //menu...
        //...button
        this.btn_nextLevel = this.createButton(x + 0.25*w, y+0.85*h, this.clickNextLevel);
        this.btn_nextLevel_img = this.add.image(x + 0.25*w, y+0.85*h, 'next level txt');

        this.btn_again = this.createButton(x + 0.75*w, y+0.85*h, this.clickTryAgain);
        this.btn_again_img = this.add.image(x + 0.75*w, y+0.85*h,'again txt');  
    }

    createButton(centerX, centerY, callback){
        let w = 4.5 * this.CONFIG.tile;
        let h = 2 * this.CONFIG.tile;
        let r = 10;

        let x = centerX - 0.5 * w;
        let y = centerY - 0.5 * h;

        //create btn graphics
        let btn = this.add.graphics({x:x, y:y});

        btn.fillStyle('0x39314B', 1);
        btn.fillRoundedRect(0, 0, w, h, r);

        //save button data
        btn.setDataEnabled();
        btn.setData('centerX', centerX);
        btn.setData('centerY', centerY);

        //create button inputs
        let hit_area = new Phaser.Geom.Rectangle(0, 0, w, h);
        btn.setInteractive(hit_area, Phaser.Geom.Rectangle.Contains);

        btn.myDownCllback = () => {
            btn.clear();
            btn.fillStyle('0x827094', 1);
            btn.fillRoundedRect(0, 0, w, h, r);
        }

        btn.myOutCllback = () => {
            btn.clear();
            btn.fillStyle('0x39314B', 1);
            btn.fillRoundedRect(0, 0, w, h, r);
        }

        btn.on('pointerup', callback, this);
        btn.on('pointerdown', btn.myDownCllback, this);
        btn.on('pointerout', btn.myOutCllback, this);

        //return graphics objects
        return btn;
    }

    clickNextLevel(){
        this.events.emit('clickNextLevel');
    }

    clickTryAgain(){
        this.events.emit('clickTryAgain');
    }
}