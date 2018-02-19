//createEnemy- ja createItem-metodeja varten
var now, delta, delta2;
then = new Date().getTime();
then2 = new Date().getTime();

$(window).load(function(){

	// *
	//yleiset muuttujat
	//onko data ladattu ja kartta luotu
	loadReady = false;
	//ladatun datan seuranta
	loaded = 0;
	//enemylista map1:en kuville
	enemy_imgs_1 = [];
	//enemylista map2:en kuville
	enemy_imgs_2 = [];
	//enemylista map3:en kuville
	enemy_imgs_3 = [];
	//enemyLista auto-objekteille
	enemys = [];
	//karttojen kuvat
	map_imgs = [];
	//poimittavat esineet
	items = [];
	//mikä kartta kyseessä
	map_index = 0;
	// ID:t eri karttojen musiikkeihin
	map_music = ["map1s", "map2s", "map3s"];
	//vihollisten id:t niiden poistamista varten
	id = 0;

	//yleiset muuttujat
	// *

	// *
	//ladataan kuvat
	vespa = new Image(); 
	enem1 = new Image();
	enem2 = new Image();
	enem3 = new Image();
	enem4 = new Image();
	enem5 = new Image();
	enem6 = new Image();
	enem7 = new Image();

	bglv1 = new Image();
	bglv2 = new Image();
	bglv3 = new Image();

	health_img = new Image();
	coin = new Image();

	vespa.src = "images/sprites/vespa_sprite_final.png"; //pelaaja
	enem1.src = "images/sprites/car_sprite0_purple.png"; //vihollinen
	enem2.src = "images/sprites/car_sprite0_green.png"; //vihollinen
	enem3.src = "images/sprites/car_sprite0_red.png"; //vihollinen
	enem4.src = "images/sprites/car_sprite1_green.png"; //vihollinen
	enem5.src = "images/sprites/car_sprite1_yellow.png"; //vihollinen
	enem6.src = "images/sprites/car_sprite1_blue.png"; //vihollinen
	enem7.src = "images/sprites/car_sprite2_white.png"; //vihollinen

	bglv1.src = "images/maps/map0.png"; //kartta 1
	bglv2.src = "images/maps/map1.png"; //kartta 2
	bglv3.src = "images/maps/map2.png"; //karttaa 3

	health_img.src = "images/items/health.png"; // health globe
	coin.src = "images/items/coin.png"; // coin globe

	map_imgs.push(bglv1);
	map_imgs.push(bglv2);
	map_imgs.push(bglv3);
	enemy_imgs_1.push(enem1);
	enemy_imgs_1.push(enem2);
	enemy_imgs_1.push(enem3);
	enemy_imgs_2.push(enem4);
	enemy_imgs_2.push(enem5);
	enemy_imgs_2.push(enem6);
	enemy_imgs_3.push(enem7);

	vespa.onload = loadCounter();
	bglv1.onload = loadCounter();
	bglv2.onload = loadCounter();
	bglv3.onload = loadCounter();
	enem1.onload = loadCounter();
	enem2.onload = loadCounter();
	enem3.onload = loadCounter();
	enem4.onload = loadCounter();
	enem5.onload = loadCounter();
	enem6.onload = loadCounter();
	enem7.onload = loadCounter();
	health_img.onload = loadCounter();
	coin.onload = loadCounter();
	//ladataan kuvat
	// *

	//mainStagen maailma(container), joka sisältää kaikki siinä olevat objektit.
	world = new createjs.Container();
	//World layer 0: Taustakuva(Map)
	wl0 = new createjs.Container();
	//World layer 1: Pelaaja ja viholliset
	wl1 = new createjs.Container();
	//lisätään wl0 ja wl1 containerit maailmaan
	world.addChild(wl0);
	world.addChild(wl1);

	// *
	//ladataan äänet

	//aina kun uusi ääni rekisteröidään
	createjs.Sound.addEventListener("fileload", handleFileLoad);
	function handleFileLoad(event) {
		loadCounter();
	}
	//taustamusiikit ja äänet on haettu nettisvuilta: http://soundbible.com, http://www.orangefreesounds.com, http://www.freesfx.co.uk/sfx ja http://incompetech.com
	createjs.Sound.registerSound({id:"map1s", src:"music/map0_theme.mp3"});	//kartta 1
	createjs.Sound.registerSound({id:"map2s", src:"music/map1_theme.mp3"}); //kartta 2
	createjs.Sound.registerSound({id:"map3s", src:"music/map2_theme.mp3"}); //kartta 3
	createjs.Sound.registerSound({id:"crash", src:"music/crash.mp3"}); //törmäys/häviö
	createjs.Sound.registerSound({id:"completed", src:"music/map_completed.mp3"}); //taso läpäisty
	createjs.Sound.registerSound({id:"click", src:"music/click.mp3"}); //clickEvent
	createjs.Sound.registerSound({id:"win", src:"music/win.mp3"}); // pelin voitto 
	createjs.Sound.registerSound({id:"lose_life", src:"music/lose_life.mp3"}); // elämän menettäminen
	createjs.Sound.registerSound({id:"full_life", src:"music/full_life.mp3"}); // elämän saaminen
	createjs.Sound.registerSound({id:"coins", src:"music/coins.mp3"}); // bonuspisteitä

	//ladataan äänet
	// *

	//pelaajan ja vihollisten välinen törmäystesti
	function playerEnemyCollision(enemy){
		//käytetään pikselitarkkaa törmäystestiä (ndgmr.Collision.js)
		var collision_test = ndgmr.checkPixelCollision(enemy.car, player.sprite, 0.75);
		if (collision_test)
			//tarkastaa onko pelaajalla elämä jäljellä
		 	if(player.lives){
				player.lives--;
				player.survive = true;
				createjs.Sound.play("lose_life");
				//pelaaja menee kuolemattomaksi sekunnin ajaksi ja muuttaa spritevärin vihreäksi
				window.setTimeout(function(){
					player.survive = false;
				}, 1000);
				return false;
			}else{
				return collision_test;
			}
		else{
			return collision_test;
		}
	}
	//vihollisten välinen törmäystesti
	function enemyEnemyCollision(enem1, enem2){
		//käytetään pikselitarkkaa törmäystestiä (ndgmr.Collision.js)
		var collision_test = ndgmr.checkPixelCollision(enem1.car, enem2.car, 0.75);
		return collision_test;
	}
	function playerItemCollision(globe){
		//käytetään pikselitarkkaa törmäystestiä (ndgmr.Collision.js)
		var collision_test = ndgmr.checkPixelCollision(globe.item, player.sprite, 0.75);
		if(collision_test) {
			//tarkastetaan, mikä item on kyseessä
			if(globe.name === "coin") {
				createjs.Sound.play("coins");				
				SCORE = SCORE + 500;
			} 
			if(globe.name === "health") {
				createjs.Sound.play("full_life");
				player.lives ++;
			}
		}
		return collision_test;
	}
	function enemyItemCollision(enem, globe){
		//käytetään pikselitarkkaa törmäystestiä (ndgmr.Collision.js)		
		var collision_test = ndgmr.checkPixelCollision(enem.car, globe.item, 0.75);
		return collision_test;
	}
	//tehdään canvas alkulataukseen (ehkä vähän turha tällä hetkellä, mutta tarkoituksena oli tehdä, joku loading animaatio)
	var canvas = document.getElementById("game");
	var context = canvas.getContext("2d");
	context.font = "bold 32px Tahoma";
	context.fillText("Loading, please wait", WIDTH/2-150, HEIGHT/2);

	//testaa, milloin lautaukset ovat valmiit, jotta pelin voi käynnistää
	function loadCounter(){
		loaded += 1;
		if(loaded == 23){
			init();
		}
	}
	//kun kaikki ladattu, pelin käynnistys
	function init(){
		//tehdään mainStage
		mainStage = new createjs.Stage("game");
		createMenus();
		createMap(map_index);
		//alustetaan pääkuuntelija
		createjs.Ticker.on("tick", tick);
		createjs.Ticker.timingMode = createjs.Ticker.RAF;

	}
	// pelin ticker
	function tick(event){
		if(!gamePaused){
			//enemyen ilmestyminen, myös fps:n mukaseks
			fps = createjs.Ticker.getMeasuredFPS();
			now = new Date().getTime();
			delta = now - then;
			delta2 = now - then2;	
			if(mapCompleted){
				if(map_index == 2){
					mapStarted = false;
					gamePaused = true;
					map_index = 0;
					finalscore.text = ("Your score is: " + SCORE + "!");
					SCORE = 0;
					showWin();
				}
				else{
					mapStarted = false;
					gamePaused = true;
					map_index ++;
					showCompleted(); //näyttää Completed menun
				}
			}
			else if(player.dead){
				deadscore.text = ("Your score is: " + SCORE + "!");
				SCORE = 0;
				map_index = 0;
				gamePaused = true;
				mapStarted = false;
				showGameOver();	//näyttää GameOver menun
			}
			else{
				player.move();
				player.bordercheck();
				map.move();
				//vihollisten luonti
				if(delta > ((60000/fps) - map_index*100)){
					then = now;
					createEnemys();
				}
				// item_globen luonti
				if(delta2 > (450000/fps)){
		
					then2 = now;
					player.lives == 1 ? createItem(coin, "coin"): createItem(health_img, "health");
				}
				//player-item collision, sekä itemin liikutus
				if(items.length == 1){
					items[0].move();
					if(playerItemCollision(items[0]) || items[0].item.y > HEIGHT){
						wl1.removeChild(items[0].item);
						items.splice(0,1);
					}
				}
				//enemyen liike, poisto ja collision
				for( i=0; i < enemys.length; i++){
					enemys[i].move();
					enemys[i].deleteEnemy();
					//enemy-enemy collision tarkastus
					if(enemys.length > 1){
						for ( j= i + 1; j < enemys.length; j++) {
							if(enemyEnemyCollision(enemys[i], enemys[j])){
								enemys[i].car.y > enemys[j].car.y ? enemys[j].speed = enemys[i].speed -1 : enemys[i].speed = enemys[j].speed -1;
							}	
						}
					}
					//player-Enemy collision tarkastus
					if(!player.survive){
						if(playerEnemyCollision(enemys[i]))
							player.die();		
					}
					//item-enemy collision
					if(items.length == 1 && enemyItemCollision(enemys[i],items[0])){
						wl1.removeChild(items[0].item);
						items.splice(0,1);
					}
				}	
			}
			//Piirtää healthin ja scoren arvon.
			updateInfo();
		}
		//päivitetään mainStage("requestAnimationFrame")
		mainStage.update(event);
	}
	// näppäimille järkevämmät nimet
	left = 37;
	up = 38;
	right = 39;
	down = 40;
	esc = 27;
	m = 77;

	left_down = false;
	right_down = false;
	up_down = false;
	down_down = false;

	//keydown tapahtumat
	$(document).keydown(function(e) {
		//mute näppäin kaikille äänille
		if(e.keyCode === m){
			if(loaded){
			!MUTE ? createjs.Sound.setMute(true) : createjs.Sound.setMute(false);
			MUTE = !MUTE;
			}
		}
		//paused menu esc-napilla
		if(e.keyCode === esc){
			if(!gamePaused && !player.dead && !player.won){
				gamePaused = true;
				if(loadReady){showPause();}
			}
		}
		if (e.keyCode === left) {
			e.preventDefault();
			left_down = true;
			if(loadReady){player.dx = -1;}		
		}
		if (e.keyCode === right) {
			e.preventDefault();
			right_down = true;
			if(loadReady){player.dx = 1;}
		}
		if (e.keyCode === up) {
			e.preventDefault();
			up_down = true;
			if(loadReady){player.dy = -1;}
		}
		if (e.keyCode === down) {
			e.preventDefault();
			down_down = true;
			if(loadReady){player.dy = 1.2;}
		}
	});

	//keyup tapahtumat
	$(document).keyup(function(e) {

		if (e.keyCode == left) {
			e.preventDefault();
			//check if player has pressed also right
			if(loadReady){right_down ? player.dx = 1 : player.dx = 0;} 
			left_down = false;
		}
		if (e.keyCode == right) {
			e.preventDefault();
			//check if player has pressed also left
			if(loadReady){left_down ? player.dx = -1 : player.dx = 0;} 
			right_down = false;
		}
		if (e.keyCode == up) {
			e.preventDefault();
			//check if player has pressed also down
			if(loadReady){down_down ? player.dy = 1 : player.dy = 0;}
			up_down = false;
		}
		if (e.keyCode == down) {
			e.preventDefault();
			//check if player has pressed also up
			if(loadReady){up_down ? player.dy = -1 : player.dy = 0;}
			down_down = false;
		}
		if(!down_down && !up_down){
			if(loadReady){player.dy = 0.5;}
		}
	});
});

//luodaan viholliset
function createEnemys(){
	if(!gamePaused && mapStarted){
		//eri kombinaatiot autojen ilmestymiselle
		var combinations = [[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[0,0,0,1,1]
						,[0,0,1,0,1],[0,1,0,0,1],[1,0,0,0,1],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0]
						,[0,1,1,0,0],[1,0,1,0,0],[1,1,0,0,0],[0,0,1,1,1],[0,1,0,1,1],[1,0,0,1,1]
						,[0,1,1,1,0],[1,0,1,1,0],[1,1,1,0,0],[1,1,0,0,1],[1,1,0,1,0],[0,1,1,1,1]
						,[1,0,1,1,1],[1,1,1,1,0],[1,1,1,0,1],[1,1,0,1,1]];									
		//valitsee randomilla mille kaistoille vihollisia ilmestyy combinations-listasta			
		var rand = combinations[Math.floor(Math.random() * combinations.length)];
		for(i=0; i < 5; i++){
			if(rand[i] == 1){
				//vihollisten valinta kartan indeksin mukaan
				if(map_index === 0){
					var rand_img = enemy_imgs_1[Math.floor(Math.random() * enemy_imgs_1.length)];
				}
				else if(map_index === 1){
					var rand_img = enemy_imgs_2[Math.floor(Math.random() * enemy_imgs_2.length)];
				}
				else{
					var rand_img = enemy_imgs_3[Math.floor(Math.random() * enemy_imgs_3.length)];
				}
				//luodaan uusi enemy				
				var enemy = new Enemy(rand_img, i, id);
				//lisätään se enemys-listaan
				enemys.push(enemy);
				//uusi ID seuraavalle autolle
				id++;
			}
		}
	}		
}
//itemin luonti
function createItem(img, name){	
	var item = new Item(img, name);
	items.push(item);
}
//aloitetaan peli (vapautetaan ticker)
function startGame(index){
	gamePaused = false;
	mapStarted = true;
}
//luodaan maa
function createMap(map_index){	
	mapHeight = 4480;
	loadReady = true;
	//Luodaan pelaaja
	player = new Player(WIDTH/2, HEIGHT-120);
	wl1.addChild(player.sprite);
	//peli kartta
	map = new Map(map_imgs[map_index], mapHeight, map_music[map_index]);
	//lisätään se maailmaan
	wl0.addChild(map.ga);
	info = new createjs.Text("", "20px Arial", "#FFF");
    info.y = 2;
    info.x = 2;
    wl0.addChild(info);
}
//tyhjentää containerit
function removeData(){
	wl1.removeAllChildren();
	wl0.removeAllChildren();
	enemys = [];	
}
