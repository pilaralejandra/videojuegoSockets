var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function (){
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
  game.load.image('life', 'assets/firstaid.png', 32, 32);
  game.load.audio('bgmusic', 'assets/music/A_A_Aalto_-_Ultraviolet.mp3');
  game.load.audio('die', 'assets/music/blaster.mp3');
  game.load.audio('collect', 'assets/music/p-ping.mp3');
}

var player;
var baddie;
var platforms;
var cursors;
var flag = true;
var stars;
var lifeImg;
var lifeCount = 3;
var score = 0;
var scoreText;
var lifeText;
var music;
var die;
var collect;

Game.create = function (){
  Game.playerMap = {};

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    music = game.add.audio('bgmusic');
    die = game.add.audio('die');
    collect = game.add.audio('collect');

    music.play();
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    Client.askNewPlayer();

    //The BADDIE and its settings
    baddie = game.add.sprite((Math.random()*700)+80, game.world.height - 96, 'baddie');
    game.physics.arcade.enable(baddie);
    baddie.animations.add('left', [0, 1], 10, true);
    baddie.animations.add('right', [2, 3], 10, true);
    baddie.body.collideWorldBounds = true;
    baddie.body.immovable = true;//  This stops it from falling away when you jump on it

	 //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

	//  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //Lifes
    lifeImg = game.add.sprite(170, 12, 'life');
    lifeText = game.add.text(220, 16, 'lifes: 3', {fontSize: '32px', fill: '#f83800'});

	//  Our controls.
    //cursors = game.input.keyboard.createCursorKeys();
    layer.inputEnabled = true;
    layer.events.onInputUp.add(Game.getCoordinates, this);


}

Game.addNewPlayer = function (id, x, y) {

  Game.playerMap[id] = game.add.sprite(x,y,'dude');
}

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.movePlayer = function(id,x,y){
    var player1 = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var duration = distance*10;
    var tween = game.add.tween(player);
    tween.to({x:x,y:y}, duration);
    tween.start();
};
