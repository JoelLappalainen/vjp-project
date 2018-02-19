function Player(x, y) {
	this.lives = 1;
	this.survive = false;
	this.width = 48;
	this.height = 48;
	this.dx = 0;
	this.dy = 0;
	this.speedY = 5;
	this.speedX = 7;
	this.dead = false;
	//pelaajan sprite data(easel.js:n sprite class ja spriteSheet class)
	var data = {
    images: [vespa],
    frames: {width:48, height:48, count: 18},
    animations: {
    	//normal
    	stationary:4,
        up:[4],
        down:[5],		
        left:[2],	
        right:[3],
        left_down:[0],
        right_down:[1],
        //survivor-mode päällä
    	s_stationary:10,
        s_up:[10],
        s_down:[11],		
        s_left:[8],	
        s_right:[9],
        s_left_down:[6],
        s_right_down:[7],
    	//ei elämiä jäljellä
    	d_stationary:16,
        d_up:[16],
        d_down:[17],		
        d_left:[14],	
        d_right:[15],
        d_left_down:[12],
        d_right_down:[13]                		
    	}
	};
//tehdään indeksoitu spritesheet ylhäällä luodusta spritedatasta
var spriteSheet = new createjs.SpriteSheet(data);
this.sprite = new createjs.Sprite(spriteSheet, "stationary");
this.sprite.play();

//pelaajan(spriten) koordinaatit
this.sprite.x = x;
this.sprite.y = y;
}

//tappaa pelaajan
Player.prototype.die = function(){
	this.dead = true;
};
//tarkastaa ettei pelaaja aja pois ajoradalta
Player.prototype.bordercheck = function(){
	if(this.sprite.x < 96){
		this.sprite.x = 96;
	}
	if(this.sprite.y < -this.height){
		this.die();
	}	
	if(this.sprite.x > 544 - this.width){
		this.sprite.x = 544 - this.width;
	}
	if(player.sprite.y > HEIGHT){
		player.die();
	}	
};
//liikuttaa pelaajaa
Player.prototype.move = function(){
	// tarkasta onks taso päästy läpi
	if(mapCompleted){
		player.dy = 0;
		player.dx = 0;
	}
	//up
	if(this.dx === 0 && this.dy === -1){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_up"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_up"); 
		else
			this.sprite.gotoAndPlay("up"); 		
	}
	//down
	else if(this.dx === 0 && this.dy === 1.2){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_down"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_down"); 
		else
			this.sprite.gotoAndPlay("down"); 
	}
	//diagonal right
	else if(this.dx === 1 && this.dy === 1.2){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_right_down"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_right_down"); 
		else
			this.sprite.gotoAndPlay("right_down");  		
	}
	//diagonal left
	else if(this.dx === -1 && this.dy === 1.2){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_left_down"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_left_down"); 
		else
			this.sprite.gotoAndPlay("left_down");  		
	}	
	//right
	else if(this.dx === 1 ){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_right"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_right"); 
		else
			this.sprite.gotoAndPlay("right");  		
	}
	//left
	else if(this.dx === -1 ){
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_left"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_left"); 
		else
			this.sprite.gotoAndPlay("left");  		
	}	
	else{
		//tutkitaan, mitä spriteä käytetään
		if(this.survive)
			this.sprite.gotoAndPlay("s_stationary"); 
		else if(this.lives === 0)	
			this.sprite.gotoAndPlay("d_stationary"); 
		else
			this.sprite.gotoAndPlay("stationary"); 		
	}				
	(this.dx != 0 && this.dy != 0) ? (this.sprite.x += this.dx*this.speedX*(1/Math.sqrt(2)), this.sprite.y += this.dy*this.speedY*(1/Math.sqrt(2))) : (this.sprite.y += this.dy*this.speedY, this.sprite.x += this.dx*this.speedX);
};
