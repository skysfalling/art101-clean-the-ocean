var allEnemies;

        function startGame() {
            player = new component(50, 50, "red", 100, 120, "player");

            /*
            box = new component(100, 100, "green", 190, 85, "box1");
            box.speedX = 2; //give box start speed
            box.speedY = -2;

            box2 = new component(75, 75, "pink", 250, 50, "box2");
            box2.speedX = 2;
            box2.speedY = 4;

            allEnemies = [box, box2];
            */

            myGameArea.start();
        }


        var myGameArea = {
            
            canvas: document.getElementById("gameCanvas"),
            start: function () {
                this.context = this.canvas.getContext("2d");
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.interval = setInterval(updateGameArea, 20);

            },
            clear: function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        function component(width, height, color, x, y, name) {
            this.color = color;

            this.width = width;
            this.height = height;
            this.speedX = 0;
            this.speedY = 0;
            this.x = x;
            this.y = y;


            this.name = name;
            this.isDead = false;

            this.update = function () {
                ctx = myGameArea.context;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);

                ctx.font = "10px Arial";

                //corners of the squares
                //needs to be in update function so that every frame the computer rechecks the values

                //				  0       1
                this.corner1 = [this.x, this.y];
                //				       0                1
                this.corner2 = [this.x + this.width, this.y];
                //				 	   0			        1
                this.corner3 = [this.x + this.width, this.y + this.height];
                //				   0	       1
                this.corner4 = [this.x, this.y + this.height];

                //corner 1:  value         position x   position y				
                ctx.fillText(this.corner1, this.x - 40, this.y);
                //corner 2:
                ctx.fillText(this.corner2, this.corner2[0] + 10, this.corner2[1]);
                //corner 3:
                ctx.fillText(this.corner3, this.corner3[0] + 10, this.corner3[1] + 10);
                //corner 4:
                ctx.fillText(this.corner4, this.corner4[0] - 40, this.corner4[1] + 10);

                //					     0			   1			  2				3
                this.allCorners = [this.corner1, this.corner2, this.corner3, this.corner4];


                if (this.isDead) //if player isn't dead, allow movement
                {
                    this.x = myGameArea.canvas.width/2;
                    this.y = myGameArea.canvas.height/2;
                    this.isDead = false;
                }

            }

            this.newPos = function () {
                this.x += this.speedX;
                this.y += this.speedY;
            }

            numCollideCorners = 0; //set variable
            this.checkCollideWithComponent = function (collisionBox) {

                ctx = myGameArea.context;
                ctx.fillStyle = this.color; //sets text to this component color
                ctx.font = "15px Arial";

                //check for connection to box (parameter)
                //ctx.fillText(collisionBox.corner1, this.corner3[0] - this.width + 20 , this.corner3[1] + 10);

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

                if (numCollideCorners > 0) {
                    this.color = "black";
                    this.speedX = 0;
                    this.speedY = 0;

                    this.isDead = true;
                }

                if (!this.isDead) { this.color = color; }


            }

            this.checkCollideWithWall = function (canvas_width, canvas_height, bounceBackSpeed) {

                ctx = myGameArea.context;
                ctx.fillStyle = this.color; //sets text to this component color
                ctx.font = "10px Arial";
                ctx.fillText("speedX : " + this.speedX, this.corner3[0] - this.width, this.corner3[1] + 20); //shows x speed
                ctx.fillText("speedY : " + this.speedY, this.corner3[0] - this.width, this.corner3[1] + 30); //shows y speed

                //for every corner in this.allCorners
                for (i = 0; i < this.allCorners.length; i++) {
                    //variable for current corner in loop
                    corner = this.allCorners[i];

                    //X VALUES ============================================
                    //LEFT SIDE
                    //if corner x is less than or equal zero....
                    if (corner[0] <= 0) {
                        if (this.speedX < 0) //if speed is negative, make it positive
                        {
                            this.speedX = bounceBackSpeed; //move the component the opposite x direction
                        }
                    }

                    //RIGHT SIDE
                    //if corner x is greater than or equal to the width of the convas...
                    if (corner[0] >= canvas_width) {
                        if (this.speedX > 0) //if speed is positive, make it negative
                        {
                            this.speedX = -bounceBackSpeed; //move the component the opposite x direction
                        }
                    }

                    //Y VALUES ==================================================
                    //TOP
                    //if corner y is less than or equal zero....
                    if (corner[1] <= 0) {
                        if (this.speedY < 0) //if speed is negative, make it positive
                        {
                            this.speedY = bounceBackSpeed; //move the component the opposite y direction
                        }
                    }

                    //BOTTOM
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
            myGameArea.clear();

            //keeps components updated
            player.update();
            /*
            box.update();
            box2.update();

            player.checkCollideWithComponent(box); //checks if player collides with a component
            player.checkCollideWithComponent(box2); //checks if player collides with a component

            */

            player.checkCollideWithWall(myGameArea.canvas.width, myGameArea.canvas.height, 2); //check if player collides with wall
            player.newPos();
            KeyDownListener();

            /*
            box.newPos();
            box.checkCollideWithWall(myGameArea.canvas.width, myGameArea.canvas.height, 2);

            box2.newPos();
            box2.checkCollideWithWall(myGameArea.canvas.width, myGameArea.canvas.height, 4);
*/

        }

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

        function reset() {
            player.isDead = false;
            player.x = 1;
            player.y = 1;
        }