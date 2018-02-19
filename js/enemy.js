function Enemy(img, lane_index, id){
	//vihollisen yksilöllinen id, jota käytetään niiden poistamiseen
	this.id = id;
	this.height = 96;
	this.car = new createjs.Bitmap(img);
	this.car.y = 0 - this.height;
	//laitetaan vihollinen oikealle kaistalle(x-koordinaatti)
	this.car.x = 88 + 94 * lane_index;
	//lisätään enemy wl1-containeriin
	wl1.addChild(this.car);
	//arvotaan vihollisen nopeus listasta randomilla
	var range = [6,7,8,9,10];
	this.speed = range[Math.floor(Math.random() * range.length)];				
}
//liikutetaan vihollisia
Enemy.prototype.move = function(){
	this.car.y += this.speed;	
};
//poistetaan vihollinen, kun se poistuu pelialueelta
Enemy.prototype.deleteEnemy = function(){
	if(this.car.y > HEIGHT + this.height){
		for(var i = enemys.length - 1; i >= 0; i--) {
			if(enemys[i].id == this.id){
				enemys.splice(i,1);
			}
		}
	}	
};