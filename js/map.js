function Map(gameArea, mapHeight, music) {
	//kartan korkeus
	this.height = mapHeight;
	// kartan musiikit
	this.music = music;
	//kartan loop counter
	counter = 0;
	//onko taso päästy läpi
	mapCompleted = false;
	//muutetaan kuva Bitmapiks
	this.ga = new createjs.Bitmap(gameArea);
	//aloitetaan kartan pohjalta
	this.ga.y =  HEIGHT - this.height;
}
Map.prototype.move = function (){
	//kartan looppaus
	if(this.ga.y > 0){
		this.ga.y = HEIGHT - this.height; 
		counter += 1;
	}
	//jos kartta on menty kaksi kertaa
	if(counter == 2){
		mapCompleted = true;
	}
	//kartan liikutus
	else if(mapCompleted === false){
		this.ga.y += 3;
	} 
};