$(document).ready(function() {

	//keeps track who's turn it is to play
	var player_turn = 1;
	//number of moves played
	var turns = 0;

	var player1 = {name: "Player1", symbol: "circle", score: 0};
	var player2 = {name: "Player2", symbol: "cross", score: 0};
	var grid = {tl: "empty", tc: "empty", tr:"empty",
				cl: "empty", cc: "empty", cr:"empty",
				bl: "empty", bc: "empty", br:"empty"};



    /*************** Change player name *********************/
    $(document).on('dblclick', '#player1_name', function(e) {
        $(this).replaceWith('<input type="text" name="player1" maxlength="10" \
        						id="player1" class="playername1 nameform">');                 
        $('#player1').focus();
    });
    
    $(document).on('dblclick', '#player2_name', function(e) {
        $(this).replaceWith('<input type="text" name="player2" maxlength="10" \
        						id="player2" class="playername2 nameform">');             
        $('#player2').focus();
    });
   
    
    $(document).keyup('.playername', function(e) {
		var code = e.which;
		var name = e.target.value;
	        
		if (code == 13 && name != "") {
	        
			e.preventDefault();
			if (e.target.id == "player1") {
				player1.name = name;
	            $('#player1').replaceWith('<a id="player1_name" class="circle \
	            							playername1 name"></a>');
	            $('#player1_name').text(name);
			} else {
				player2.name = name;
	            $('#player2').replaceWith('<a id="player2_name" class="cross \
	            							playername2 name"></a>');
	            $('#player2_name').text(name);
			}
		}
	});
	/********************************************************/

	// Play using numpad
	$(document).keyup('.cell', function(e) {
		var code = e.which;
		switch(code) {
			case 96: //0
				resetGrid();
				break;
			case 97: //1
				playTurn($('#bl'), 'bl');
				break;
			case 98: //2
				playTurn($('#bc'), 'bc');
				break;
			case 99: //3
				playTurn($('#br'), 'br');
				break;
			case 100: //4
				playTurn($('#cl'), 'cl');
				break;
			case 101: //5
				playTurn($('#cc'), 'cc');
				break;
			case 102: //6
				playTurn($('#cr'), 'cr');
				break;
			case 103: //7
				playTurn($('#tl'), 'tl');
				break;554
			case 104: //8
				playTurn($('#tc'), 'tc');
				break;
			case 105: //9
				playTurn($('#tr'), 'tr');
				break;
			default:
				break;
		}
	});

	//Play with mouse
	$('.cell').on('click', function(e) {
		var cell = e.target.id;
		playTurn($(this), cell);
	});


	$('#reset_grid').on('click', function() {
		resetGrid();
	});
    
    $('#reset_score').on('click', function() {
        resetScore();
    });


    //Main game function. 
    function playTurn(cell, cellname) {
		
		if (cell.hasClass('is-disabled')) {
			return;
		}
		
		cell.text(drawSymbol());
		cell.removeClass("cross circle").addClass(changeCellState());
		alterGrid(cellname, changeCellState());
		cell.addClass('is-disabled');
		turns += 1;

		if (win() == true) { 
			$('#score').text("Winner"); 
			increaseScore();
			$('.cell').addClass("is-disabled");
            markLoss();
		} else if (draw()) {
			$('#score').text("Draw");
            markLoss();
		}

		nextTurn();
	}

	//Tracks turn and highlight the players name
    function nextTurn() {
		if (player_turn == 1) {
		 	player_turn = 2;
		 	$('#player1_name').removeClass('active');
		 	$('#player2_name').addClass('active');
		} else {
			player_turn = 1;
			$('#player2_name').removeClass('active');
		 	$('#player1_name').addClass('active');
		}
	}

	function increaseScore() {
		if (player_turn == 1) {
			player1.score += 1;
		} else {
			player2.score += 1;
		}
        updateScore();
	}

	//Fills cell with corresponding symbol
	function drawSymbol() {
		return player_turn == 1 ? "O" : "X";
	}

	//Adds class to newly filled cell
	function changeCellState() {
		return player_turn == 1 ? "circle" : "cross";
	}

	//Updates grid object
	function alterGrid(cell, state) {
		grid[cell] = state;
	}
    
    function resetGrid() {
    	grid = {tl: "empty", tc: "empty", tr:"empty",
				cl: "empty", cc: "empty", cr:"empty",
				bl: "empty", bc: "empty", br:"empty"};
		$('.cell').removeClass("cross circle is-disabled win loss").text("");
		console.log($('tr').children());
		turns = 0; 
    }

    function resetScore() {
    	player1.score = 0;
        player2.score = 0;
        updateScore();
    }

    function updateScore() {
        $('#player1_score').text(player1.score);
        $('#player2_score').text(player2.score);
    }

    //Add a .loss class after a win or draw to non-winning cells
    function markLoss() {
        $('.cell').not('.win').addClass('loss');
    }

    //Checks if it is a draw
	function draw() {
		return !win() && fullGrid();
	}

	//Checks if the frid is full
	function fullGrid() {
		return turns == 9;
	}


    /**************************** WINNING SCENARIOS *******************************/
	function win() {
		return winDiagonal() || winRow() || winCol();
	}
 
	function winDiagonal() {
		if (grid.tl == grid.cc && grid.tl == grid.br && grid.tl != "empty") {
            $('#tl').addClass('win');
            $('#cc').addClass('win');
            $('#br').addClass('win');
            return true;
        } else if (grid.tr == grid.cc && grid.tr == grid.bl && grid.tr != "empty") {
            $('#tr').addClass('win');
            $('#cc').addClass('win');
            $('#bl').addClass('win');
            return true;
        }
        return false;
	}

	function winRow() { 
		if (grid.tl == grid.tc && grid.tl == grid.tr && grid.tl != "empty") {
            $('#tl').addClass('win');
            $('#tc').addClass('win');
            $('#tr').addClass('win');
            return true;
        } else if (grid.cl == grid.cc && grid.cl == grid.cr && grid.cl != "empty") {
            $('#cl').addClass('win');
            $('#cc').addClass('win');
            $('#cr').addClass('win');
            return true;
        } else if (grid.bl == grid.bc && grid.bl == grid.br && grid.bl != "empty") {
            $('#bl').addClass('win');
            $('#bc').addClass('win');
            $('#br').addClass('win');        
            return true;
        }
        return false;
	}

	function winCol() {
		if (grid.tl == grid.cl && grid.tl == grid.bl && grid.tl != "empty") {
            $('#tl').addClass('win');
            $('#cl').addClass('win');
            $('#bl').addClass('win');
            return true;
        } else if (grid.tc == grid.cc && grid.tc == grid.bc && grid.tc != "empty") {
            $('#tc').addClass('win');
            $('#cc').addClass('win');
            $('#bc').addClass('win');
            return true;
        } else if (grid.tr == grid.cr && grid.tr == grid.br && grid.tr != "empty") {
            $('#tr').addClass('win');
            $('#cr').addClass('win');
            $('#br').addClass('win');
            return true;
        }
        return false;
	}
    
/************************ THEME CONTROL ************************/
    
    $('#dark').on('click', function() {
        $('#thm').attr('href', 'css/theme_dark.css');      
    });
    
    $('#normal').on('click', function() {
        $('#thm').attr('href', 'css/theme_normal.css');      
    });
    
    $('#orange_blue').on('click', function() {
        $('#thm').attr('href', 'css/theme_orange_blue.css');      
    });


});