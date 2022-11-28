


// CREATE ARRAY OF TRASH IMAGES
const trash1_img = new Image();
trash1_img.src = "../img/trash1.png";
const trash2_img = new Image();
trash2_img.src = "../img/trash2.png";
const trash3_img = new Image();
trash3_img.src = "../img/trash3.png";
const trash4_img = new Image();
trash4_img.src = "../img/trash4.png";
var trash_imgs = [trash1_img, trash2_img, trash3_img, trash4_img];

// CREATE BUBBLE IMAGE
const bubbleImg = new Image();
bubbleImg.src = "../img/bubble1.png";


// CREATE FISH ANIMATION
const frame1 = new Image();
frame1.src = "img/playerAnim/frame1.png";
const frame2 = new Image();
frame2.src = "img/playerAnim/frame2.png";
const frame3 = new Image();
frame3.src = "img/playerAnim/frame3.png";
const frame4 = new Image();
frame4.src = "img/playerAnim/frame4.png";
var playerAnim = [frame1, frame2, frame3, frame4];

// << COMPONENT HOLDER >>
var bubbles = [];
var trash_components = [];
var player;


var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.animation = setInterval(animationHandler, 240);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startGame() {
    myGameArea.start();

    player = new component(100, 100, (myGameArea.canvas.width / 2), 0, "player");
    player.animateImgs = playerAnim;

    // random spawn enemies
    randomSpawnComponents(20, [50, 150], [-2, 2], trash_imgs, trash_components, "trash");

    // random spawn bubbles
    randomSpawnComponents(20, [100, 150], [-3, 3], [bubbleImg], bubbles, "bubble");
}


function component(width, height, x, y, name, img = null, bounceBackSpeed = 2) {
    this.color = "red";
    this.width = width;
    this.height = height;
    this.speedX = 2;
    this.speedY = 2;
    this.speedLimit = 20;
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.name = name;
    this.isDead = false;
    this.img = img;
    this.bounceBackSpeed = bounceBackSpeed;
    this.animateImgs = [];
    this.currAnimationFrame = 0;

    this.animate = function(loop = true){
        ctx = myGameArea.context;
        this.img = playerAnim[this.currAnimationFrame]; // update current animation
        
        // check if not end of animation
        if ( 
            this.currAnimationFrame < this.animateImgs.length - 1){
            this.currAnimationFrame += 1;
        }
        // check if loop
        else if (loop)
        { 
            this.currAnimationFrame = 0; 
        }
    }

    this.update = function () {
        ctx = myGameArea.context;

        // <<<<<<<<< DRAW COMPONENT >>>>>>>>>>>>
        if (this.img != null){
            drawComponent(this, this.img);
        }
        else 
        { 
            ctx.fillStyle = "green";
            ctx.rect(this.x , this.y, this.width, this.height);
        }

        this.setCorners();

        this.newPos();
        this.checkCollideWithWall(myGameArea.canvas.width, myGameArea.canvas.height, this.bounceBackSpeed);
    }

    this.reset = function(){
        this.x = this.startX;
        this.y = this.startY;
        this.speedX = 0;
        this.speedY = 0;
        this.isDead = false;
        ctx.fillStyle = this.color;
    }

    this.debug = function(){
        ctx = myGameArea.context;

        // << DEBUG >>
        //check for connection to box (parameter)
        ctx.fillText(this.corner1, this.corner3[0] - this.width + 20 , this.corner3[1] + 10);

        ctx.strokeRect(this.x , this.y, this.width, this.height);
        ctx.strokeStyle = "red";

    }

    // << POSITION AND COLLISIONS >>
    this.setCorners = function(){
        //needs to be in update function so that every frame the computer rechecks the values

        //				  0       1
        this.corner1 = [this.x, this.y];
        //				       0                1
        this.corner2 = [this.x + this.width, this.y];
        //				 	   0			        1
        this.corner3 = [this.x + this.width, this.y + this.height];
        //				   0	       1
        this.corner4 = [this.x, this.y + this.height];

        //					     0			   1			  2				3
        this.allCorners = [this.corner1, this.corner2, this.corner3, this.corner4];

        /*
        //corner 1:  value         position x   position y				
        ctx.fillText(this.corner1, this.x - 40, this.y);
        //corner 2:
        ctx.fillText(this.corner2, this.corner2[0] + 10, this.corner2[1]);
        //corner 3:
        ctx.fillText(this.corner3, this.corner3[0] + 10, this.corner3[1] + 10);
        //corner 4:
        ctx.fillText(this.corner4, this.corner4[0] - 40, this.corner4[1] + 10);
        */
    }

    // <<<< MOVE THE COMPONENT >>>>
    this.newPos = function () {

        if (this.speedX > this.speedLimit) {this.speedX = this.speedLimit;}
        if (this.speedY > this.speedLimit) {this.speedY = this.speedLimit;}

        this.x += this.speedX;
        this.y += this.speedY;

        //ctx.fillText("speedX : " + this.speedX, this.corner3[0] - this.width, this.corner3[1] + 20); //shows x speed
        //ctx.fillText("speedY : " + this.speedY, this.corner3[0] - this.width, this.corner3[1] + 30); //shows y speed
    }

    // <<<< COLLIDE WITH OTHER COMPONENTS >>>>
    numCollideCorners = 0; //set variable
    this.checkCollideWithComponent = function (collisionBox, func) {

        ctx = myGameArea.context;

        //how many corners collide?
        numCollideCorners = 0;
        //ctx.fillText(numCollideCorners, this.corner3[0] - this.width + 20 , this.corner3[1] + 10);

        //for every corner in this.allCorners
        for (i = 0; i < this.allCorners.length; i++) {
            //variable for current corner in loop
            corner = this.allCorners[i];

            //       if corner x > box C1 x		    AND   corner x < box C2 x			then....
            if (corner[0] > collisionBox.corner1[0] && corner[0] < collisionBox.corner2[0]) {
                //    if corner y > box C1 y		    AND    corner y < box C4 y		   then....
                if (corner[1] > collisionBox.corner1[1] && corner[1] < collisionBox.corner4[1]) {
                    //this.color = "blue";
                    numCollideCorners++;
                }
            }
        }

        // if collides
        if (numCollideCorners > 0) {
            return true;
        }
        else{
            return false;
        }
    }

    // <<<< COLLIDE WITH WALL >>>>
    this.checkCollideWithWall = function (canvas_width, canvas_height, bounceBackSpeed) {

        ctx = myGameArea.context;
        ctx.fillStyle = this.color; //sets text to this component color
        ctx.font = "10px Arial";


        //for every corner in this.allCorners
        for (i = 0; i < this.allCorners.length; i++) {
            //variable for current corner in loop
            corner = this.allCorners[i];

            // ============= X VALUES ============================================
            //LEFT SIDE
            //if corner x is less than or equal zero....
            //console.log("corner", i , " x " , corner[0]);
            if (corner[0] <= 0) {
                if (this.speedX < 0) //if speed is negative, make it positive
                {
                    this.speedX = bounceBackSpeed; //move the component the opposite x direction
                }
            }

            // RIGHT SIDE
            //if corner x is greater than or equal to the width of the convas...
            if (corner[0] >= canvas_width) {
                if (this.speedX > 0) //if speed is positive, make it negative
                {
                    this.speedX = -bounceBackSpeed; //move the component the opposite x direction
                }
            }

            // ============== Y VALUES ==================================================
            // TOP
            //if corner y is less than or equal zero....
            if (corner[1] <= 0) {
                if (this.speedY < 0) //if speed is negative, make it positive
                {
                    this.speedY = bounceBackSpeed; //move the component the opposite y direction
                }
            }

            // BOTTOM
            //if corner y is greater than or equal to the height of the canvas...
            if (corner[1] >= canvas_height) {
                if (this.speedY > 0) //if speed is positive, make it negative
                {
                    this.speedY = -bounceBackSpeed; //move the component the opposite y direction
                }
            }
        }
    }
}

function KeyDownListener() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        /*
        if (event.key != " ") { document.getElementById("buttonPressed").innerHTML = event.key; }
        else { document.getElementById("buttonPressed").innerHTML = "Spacebar"; }
        */

        switch (event.key) {
            case "ArrowDown":
                // code for "down arrow" key press.
                movedown();
                break;
            case "ArrowUp":
                // code for "up arrow" key press.
                moveup();
                break;
            case "ArrowLeft":
                // code for "left arrow" key press.
                moveleft();
                break;
            case "ArrowRight":
                // code for "right arrow" key press.
                moveright();
                break;
            case " ":
                // code for " " key press.
                slowDown();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
}

function updateGameArea() {
    // refresh
    myGameArea.clear();
    myGameArea.canvas.width = window.innerWidth;

    // input listener
    KeyDownListener();

    // scroll window to follow player
    scrollToPlayer();

    // << UPDATE PLAYER >>
    player.update();

    // << UPDATE BUBBLES >>
    bubbles.forEach(bubble => {
        bubble.update();
    });


    // << ENEMY ENGAGEMENT >>
    trash_components.forEach(enemy => {
        enemy.update();

        // check for player collision
        if (player.checkCollideWithComponent(enemy))
        {
            console.log("collide");
            player.reset();
        }
    });

}

// ==================== HELPER FUNCTIONS ==============================

function animationHandler(){
    player.animate();
}

function randomSpawnComponents(count , sizeRange, initSpeedRange, image_array, component_array, name){
    
    for (i = 0; i < count; i++)
    {
        // set random size 
        randSize = getRandomInt(sizeRange[0], sizeRange[1]);

        // set random height on screen
        randYPos = getRandomInt(randSize, myGameArea.canvas.height - randSize);

        // get rand Image
        randImage = image_array[getRandomInt(0, image_array.length - 1)];

        // create new component
        new_component = new component(randSize, randSize,(myGameArea.canvas.width / 2) + randSize, randYPos, name + i , randImage , 4);
        new_component.speedX = getRandomInt(initSpeedRange[0], initSpeedRange[1]);
        new_component.speedY = getRandomInt(initSpeedRange[0], initSpeedRange[1]);

        component_array.push(new_component);

        // DEBUG 
        //console.log(new_component.name);
        //console.log("rand_image: ", randImage);
    }
}

// TODO: ROTATE IMAGE AS IT BOUNCES ?
//                          component >> img
function drawComponent(com, img)
{
    //            draw curr img,    offset position of image based off of scale 
    ctx.drawImage(img, com.x - com.width/2, com.y - com.height/2, com.width * 2, com.height * 2);
}

// move 'camera' to player position
function scrollToPlayer()
{
    window.scrollTo(player.x, player.y - window.innerHeight / 4);
}

// get random int
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ====================== MOVEMENT ===============================

function moveup() {
    player.speedY -= 1;
}

function movedown() {
    player.speedY += 1;
}

function moveleft() {
    player.speedX -= 1;
}

function moveright() {
    player.speedX += 1;
}

function slowDown() {
    if (Math.abs(player.speedX) > 0) //if x is moving
    {
        if (player.speedX > 0) { player.speedX -= 1; } //if moving right, subtract
        else { player.speedX += 1 } //if moving left, add
    }

    if (Math.abs(player.speedY) > 0) //if y is moving
    {
        if (player.speedY > 0) { player.speedY -= 1; } //if moving down, subtract
        else { player.speedY += 1 } //if moving up, add
    }
}


