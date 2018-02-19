
function Item (img, name){
	this.name = name;
	this.width = 36;
	this.height = 36;
	this.item = new createjs.Bitmap(img);
	//itemin koordinaatit
	var rand_x = Math.floor((Math.random() * (WIDTH - 192 - this.width)) + 0);
	this.item.x = 96 + rand_x;
	this.item.y = 0 - this.height;
	//itemin lisäys wl1-containeriin
	wl1.addChild(this.item);	
}
//itemin liikutus
Item.prototype.move = function(){
	this.item.y += 9;	
};