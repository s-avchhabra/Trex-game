var trex, trex_running,edges,trex_collided;
var groundImg,ground,invsGround;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var cloudImg;
var OVER = 0;
var PLAY = 1;
var gameState = PLAY;
var obstacleGroup,cloudGroup;
var restartImg;
var score = 0;
var gameOverImg;

function preload(){
  
  gameOverImg = loadImage("gameOver.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  restartImg = loadImage("restart.png");
  trex_collided = loadImage("trex_collided.png");
  groundImg = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  cloudImg = loadImage("cloud.png");
}
 
function setup() {
  createCanvas(600, 200);
  
  //create trex sprite
  trex = createSprite(50,170,30,50);
  trex.addAnimation("runningtrex",trex_running);
  trex.addAnimation("collidedTrex",trex_collided);
  trex.scale = 0.5;
  
  //create sprite restart
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  restart.scale = 0.7;
  
  //create gameOver sprite
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //create obstacle group
  obstacleGroup = new Group();
  
  //create cloud group
  cloudGroup = new Group();
  
  //create ground sprite
  ground = createSprite(300,180,600,10);
  ground.addImage(groundImg);
  ground.x = ground.width/2;
  
  //create invisible ground sprite
  invsGround = createSprite(300,195,600,10);
  invsGround.visible = false;
                  
  edges = createEdgeSprites();   
  
}

function draw() {
  background(255);
  
  if (gameState === PLAY) {
    
    score = score + Math.round(getFrameRate()/60);
    
    restart.visible = false;
    gameOver.visible = false;
  
    //display score
    text("Score: "+ score, 500, 10);
    
    spawnObstacles();
    spawnClouds();

    ground.velocityX = -2;

    if(ground.x < 0) {
      ground.x = ground.width/2;
    }

    //make trex jump
    if (keyDown("space")&& trex.y > 166) {
     trex.velocityY = -10; 
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.5;

    trex.collide(invsGround);

    if(obstacleGroup.isTouching(trex)) 
    {
      gameState = OVER;
    }
  }
  
  
 
  if (gameState === OVER)
  {
    restart.visible = true;
    gameOver.visible = true;
    
    //set the velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocity = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collidedTrex",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    if (mousePressedOver(restart)) 
  {
   reset(); 
  }
  }
  
  drawSprites();
}

function spawnObstacles () {
  
  if (frameCount % 80 === 0) {
   
    var obstacle = createSprite(600,170);
    var rand = int(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default:break;
    }
    obstacle.scale = 0.5;
    obstacle.velocityX = -5
    obstacleGroup.add(obstacle);
  }
  
}

function spawnClouds () {
  if (frameCount % 60 === 0) {
   var cloud = createSprite(600,random(80,120));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -2;
    
    cloud.depth = trex.depth;
    trex.depth++
    console.log(cloud.depth,trex.depth);
    cloudGroup.add(cloud);
  }
  }

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("runningtrex",trex_running);
  score = 0;
}