//canvaksen mitat
WIDTH = 640;
HEIGHT = (($(window).height() > 750 ? 750 : $(window).height()) - 15);
//onko peli pausella
gamePaused = true;
//onko karttaa aloitettu
mapStarted = false;
//onko äänet pois päältä
MUTE = false;
//pelaajan score
SCORE = 0;

// Muuta canvaksen piirto- ja todellinen korkeus
var can = document.getElementById("game");
can.style.height = HEIGHT + "px";
can.height = HEIGHT;

//Piirtää healtin ja scoren
function updateInfo(){
	SCORE = SCORE + 1;
	info.text = "Score: " + SCORE + " Health: " + player.lives;
}
//tuo pelin näkyviin
function showGame(){
	mainStage.removeAllChildren();
	mainStage.addChild(world);
	if(mapStarted){
		music.resume();
	}
	else{
		music = createjs.Sound.play(map.music, {loop:-1});
	}
}
//näyttää main menun
function showMain(){
	mainStage.removeAllChildren();
	mainStage.addChild(main_menu);
}
//näyttää ohjeet
function showInstructions(){
	mainStage.removeAllChildren();
	mainStage.addChild(instructions_menu);
}
//näyttää tekijät
function showCredits(){
	mainStage.removeAllChildren();
	mainStage.addChild(credits_menu);
}
//näyttää pause menun
function showPause(){
	mainStage.removeAllChildren();
	mainStage.addChild(paused_menu);
	music.pause();
}
//näyttää taso läpi- mäkymän
function showCompleted(){
	createjs.Sound.play("completed");
	mainStage.removeAllChildren();
	mainStage.addChild(completed_menu);
	music.pause();
}
// näyttää peli ohi- näkymän
function showGameOver(){
	createjs.Sound.play("crash");
	mainStage.removeAllChildren();
	mainStage.addChild(gameOver_menu);
	music.pause();
}
//näyttää voittomenun
function showWin(){
	createjs.Sound.play("win");
	mainStage.removeAllChildren();
	mainStage.addChild(win_menu);
	music.pause();
}
//luo menut ja niiden nappulat
function createMenus(){
	// Main Menu --------------------------------------------------
		main_menu = new createjs.Container();
		main_background = new createjs.Bitmap("images/menus/vespa_mainmenu_background.png");
		credits_button = new createjs.Bitmap("images/menus/vespa_mainmenu_credits.png");
		play_button = new createjs.Bitmap("images/menus/vespa_mainmenu_play.png");
		instructions_button = new createjs.Bitmap("images/menus/vespa_mainmenu_instructions.png");
		//lisätään kuvat main_menu containeriin
		main_menu.addChild(main_background, credits_button, play_button, instructions_button);
		//tuodaan main manu näkyviin
		mainStage.addChild(main_menu);
		// nappien tapahtumakuuntelijat:
		play_button.on("click", function(event) {
			then = new Date().getTime();
			then2 = new Date().getTime();
			createjs.Sound.play("click");
			if(loadReady){
				removeData();
				createMap(map_index);
			}
     		showGame();
     		startGame();
 		});
 		credits_button.on("click", function(event) {
			createjs.Sound.play("click");
     		showCredits();
     	
 		});	
		instructions_button.on("click", function(event) {
			createjs.Sound.play("click");
     		showInstructions(); 		
 		});
	// Main Menu End ----------------------------------------------	

	// Paused Menu ------------------------------------------------
		paused_menu = new createjs.Container();
		paused_background = new createjs.Bitmap("images/menus/vespa_pausedmenu.png");
		paused_continue_button = new createjs.Bitmap("images/menus/vespa_paused_continue.png");
		paused_restart_button = new createjs.Bitmap("images/menus/vespa_paused_restart.png");
		paused_menu.addChild(paused_background, paused_continue_button, paused_restart_button);
		//nappien tapahtumakuuntelijat
		paused_continue_button.on("click" , function(event) {
			createjs.Sound.play("click");
			gamePaused = false;
			showGame();		
		});
		paused_restart_button.on("click" , function(event) {
			then = new Date().getTime();
			then2 = new Date().getTime();
			createjs.Sound.play("click");
			map_index = 0;
			mapStarted = false;
			removeData();
			createMap(map_index);
			showGame();
			startGame();
		});			
	// Paused Menu  End -------------------------------------------

	// Completed Menu ---------------------------------------------------
		completed_menu = new createjs.Container();
		completed_background = new createjs.Bitmap("images/menus/vespa_levelComp.png");
		completed_continue_button = new createjs.Bitmap("images/menus/vespa_levelComp_continue.png");
		completed_menu.addChild(completed_background, completed_continue_button);
		//napin tapahtumakuuntelija
		completed_continue_button.on("click" , function(event) {
			then = new Date().getTime();
			the2 = new Date().getTime();
			createjs.Sound.play("click");
			gamePaused = false;
			removeData();
			createMap(map_index);
			showGame();
			startGame();
		});		
	// Completed Menu  End ----------------------------------------------

	// Win Menu ---------------------------------------------------
		win_menu = new createjs.Container();
		win_background = new createjs.Bitmap("images/menus/vespa_victory_background.png");
		win_mainmenu_button = new createjs.Bitmap("images/menus/vespa_victory_mainmenu.png");
		finalscore = new createjs.Text("", "40px Arial", "#000000");
    	finalscore.y = 295;
    	finalscore.x = 25;
		win_menu.addChild(win_background, win_mainmenu_button);
		win_menu.addChild(finalscore);
		//napin tapahtumakuuntelija
		win_mainmenu_button.on("click" , function(event) {
			createjs.Sound.play("click");
			removeData();
			showMain();
		});		
	// Win Menu  End ----------------------------------------------

	// Dead Menu --------------------------------------------------
		gameOver_menu = new createjs.Container();
		gameOver_background = new createjs.Bitmap("images/menus/vespa_gameover_background.png");
		gameOver_menu_button = new createjs.Bitmap("images/menus/vespa_gameover_menu.png");
		gameOver_restart_button = new createjs.Bitmap("images/menus/vespa_gameover_restart.png");
		gameOver_menu.addChild(gameOver_background, gameOver_menu_button, gameOver_restart_button);
		//näyttää pelaajan pisteet
		deadscore = new createjs.Text("", "40px Arial", "#000000");
		deadscore.y = 300;
		deadscore.x = 40;
		gameOver_menu.addChild(deadscore);
		//nappien tapahtumakuuntelijat
		gameOver_menu_button.on("click" , function(event) {
			createjs.Sound.play("click");
			map_index = 0;
			removeData();
			gamePaused = true;
			showMain();	
		});
		gameOver_restart_button.on("click" , function(event) {
			then = new Date().getTime();
			then2 = new Date().getTime();
			createjs.Sound.play("click");
			map_index = 0;
			if(loadReady){
				removeData();
				createMap(map_index);
			}
     		showGame();
     		startGame();
		});	
	// Dead Menu  End ---------------------------------------------

	// Credits Menu -----------------------------------------------
		credits_menu = new createjs.Container();
		credits_background = new createjs.Bitmap("images/menus/vespa_credits.png");
		credits_back_button = new createjs.Bitmap("images/menus/vespa_back.png");
		credits_menu.addChild(credits_background, credits_back_button);
		//napin tapahtumakuuntelija
		credits_back_button.on("click" , function(event) {
			createjs.Sound.play("click");
			showMain();	
		});
	// Credits Menu End -------------------------------------------

	// Instruction Menu -------------------------------------------
		instructions_menu = new createjs.Container();
		instructions = new createjs.Bitmap("images/menus/vespa_instructions.png");
		instructions_background = new createjs.Bitmap("images/menus/vespa_pausedmenu.png");
		instructions_back_button = new createjs.Bitmap("images/menus/vespa_back.png");
		instructions_menu.addChild(instructions_background, instructions, instructions_back_button);
		//napin tapahtumakuuntelija
		instructions_back_button.on("click" , function(event) {
			createjs.Sound.play("click");
			showMain();			
		});		
	// Instruction Menu  End --------------------------------------
}