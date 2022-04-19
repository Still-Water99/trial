var trex, trex_running, ground, ground_image, inv_ground;
var cloud, cloud_image;
var obs, obs_image1, obs_image2, obs_image3, obs_image4, obs_image5, obs_image6;
var score = 0;
var trex_collide;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var restart, restart_image, gameOver, gameOver_image;
var checkpoint_sound, die_sound, jump_sound;


function preload() {
    cloud_image = loadImage("cloud.png");
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png"); //loads animation
    ground_image = loadImage("ground2.png");
    obs_image1 = loadImage("obstacle1.png");
    obs_image2 = loadImage("obstacle2.png");
    obs_image3 = loadImage("obstacle3.png");
    obs_image4 = loadImage("obstacle4.png");
    obs_image5 = loadImage("obstacle5.png");
    obs_image6 = loadImage("obstacle6.png");
    trex_collide = loadAnimation("trex_collided.png");
    restart_image = loadImage("restart.png");
    gameOver_image = loadImage("gameOver.png");

    checkpoint_sound = loadSound("checkpoint.mp3");
    die_sound = loadSound("die.mp3");
    jump_sound = loadSound("jump.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    trex = createSprite(50, 160, 25, 25);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collide);
    trex.scale = 0.5;
    trex.debug = true;
    //trex.setCollider("rectangle", 0, 0, 400, trex.height);

    ground = createSprite(300, height - 180, 600, 20)
    ground.addImage("ground", ground_image);
    ground.x = ground.width / 2;

    inv_ground = createSprite(300, height - 170, 600, 10)
    inv_ground.visible = false;

    restart = createSprite(300, 150, 30, 30);
    restart.addImage("restart", restart_image);
    restart.scale = 0.5;
    restart.visible = false;

    gameOver = createSprite(300, 100, 30, 30);
    gameOver.addImage("gameOver", gameOver_image);
    gameOver.scale = 2;
    gameOver.visible = false;

    //create obstacle and cloud group
    obstaclesGroup = new Group();
    cloudsGroup = new Group();
}

function draw() {
    background(255);
    trex.collide(inv_ground);
    if (gameState == PLAY) {
        score = score + Math.round(getFrameRate() / 60);

        trex.velocityY += 0.5; //adds gravity

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }
        ground.velocityX = -(6 + (score / 10));

        //makes trex jump
        if (keyDown(UP_ARROW) || touches.length > 0 && (trex.y > 160)) {
            trex.velocityY = -10;
            jump_sound.play();
            touches = [];
        }

        //ground.velocityX = -6;

        if (obstaclesGroup.isTouching(trex)) {
            gameState = END;
            die_sound.play();
            /*trex.velocityY = -10;
            jump_sound.play();*/
        }

        if ((score % 100 == 0) && (score != 0)) {
            checkpoint_sound.play();
        }
        spawnClouds();
        spawnObstacles();

    } else if (gameState == END) {
        ground.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        trex.changeAnimation("collided", trex_collide);
        trex.velocityY = 0;
        restart.visible = true;
        gameOver.visible = true;
        if (mousePressedOver(restart)) {
            reset();
        }
    }

    text("score:" + score, 500, 50);

    drawSprites();
}

function spawnClouds() {
    if (frameCount % 60 == 0) {
        cloud = createSprite(610, Math.round(random(40, 100)), 20, 20);
        cloud.velocityX = -3;
        cloud.lifetime = 205;
        cloud.addImage("cloud", cloud_image);
        cloud.scale = 0.5;
        cloud.depth = trex.depth;
        trex.depth += 1;

        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
    if (frameCount % 60 == 0) {
        obs = createSprite(610, 170, 20, 20);
        obs.velocityX = -(6 + (score / 10));
        obs.lifetime = 305;
        obs.scale = 0.5;
        obs.depth = trex.depth;

        var rand = Math.round(random(1, 6));
        switch (rand) {
            case 1:
                obs.addImage("obstacle1", obs_image1);
                break;
            case 2:
                obs.addImage("obstacle2", obs_image2);
                break;
            case 3:
                obs.addImage("obstacle3", obs_image3);
                break;
            case 4:
                obs.addImage("obstacle4", obs_image4);
                break;
            case 5:
                obs.addImage("obstacle5", obs_image5);
                break;
            case 6:
                obs.addImage("obstacle6", obs_image6);
                break;
            default:
                break;
        }

        obstaclesGroup.add(obs);
    }
}

function reset() {
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    restart.visible = false;
    gameOver.visible = false;
    trex.changeAnimation("running", trex_running);
    gameState = PLAY;
    score = 0;
}