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
  //Add random stars
    //game.add.sprite((Math.random()*800)+1, (Math.random()*600)+1, 'star');

	//  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    music = game.add.audio('bgmusic');
    die = game.add.audio('die');
    collect = game.add.audio('collect');

    //game.sound.setDecodedCallback([ die, collect ], start, this);

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
	//Here I can create another ledge
	//ledge = platforms.create(200, 300, 'ground');
	//ledge.scale.setTo(.5, 2);
    //ledge.body.immovable = true;

	// The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.5;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


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
    cursors = game.input.keyboard.createCursorKeys();
}

Game.update = function () {
	//  Collide the player and the stars with the platforms
  var hitPlatform =  game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
  //game.physics.arcade.collide(player, baddie);

	//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, baddie, baddieOverlap, null, this);

	//  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    baddie.body.velocity.x = 0;//This stop sliding

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    //&& player.body.touching.down && hitPlatform
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -350;
    }

    if (flag) {
      baddie.body.velocity.x = 200;
      baddie.animations.play('right');
      if (baddie.x == game.world.width -32) {
        flag = false;
      }
    }else {
      baddie.body.velocity.x = -200;
      baddie.animations.play('left');
      if (baddie.x == 0) {
        flag = true;
      }
    }
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

	//  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
    collect.play();
    if (score == 120) {
      music.pause();
      alert('You won the game, congratulations!');
      location.reload();
    }

}

function baddieOverlap(player, baddie) {

  player.kill();
  baddie.kill();

  player.reset(32, game.world.height - 150);
  baddie.reset((Math.random()*700)+80, game.world.height - 96);
  flag = true;
  lifeCount -= 1;
  lifeText.text = 'Lives: ' + lifeCount;
  die.play();
  if (lifeCount == 0) {
    music.pause();
    alert('You lose :(');
    location.reload();
  }
}
