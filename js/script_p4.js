
$(document).ready(function() {

	//keeps track who's turn it is to play
	var player_turn = 1;
	//number of moves played
	var turns = 0;

	var player1 = {name: "Player1", symbol: "circle", score: 0};
	var player2 = {name: "Player2", symbol: "cross", score: 0};
	var grid = {col0: [], col1: [], col2: [], col3: [], col4: [], col5: [], col6: []};
	var col0, col1, col2, col3, col4, col5, col6 = [0,0,0,0,0,0];



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

	//Play with mouse
	$('.cell_p4').on('click', function(e) {
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

		console.log("cellname0: " + cellname);
		cellname = getGoodCell(cell, cellname);
		console.log("cellname1: " + cellname);

		cell = $('#' + cellname);




		cell.addClass(changeCellState());
		//alterGrid(cellname, changeCellState());
		cell.addClass('is-disabled');
		turns += 1;

		// if (turns > 6) {
		// 	if (win(cellname) == true) {
		// 		$('#score').text("Winner"); 
		// 		increaseScore();
		// 		$('.cell').addClass("is-disabled");
	 //            markLoss();
		// 	} else if (draw()) {
		// 		$('#score').text("Draw");
	 //            markLoss();
		// 	}
		// }	
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

	function getGoodCell(cell, cellname) {
		var row = cellname[0];
		var col = "col" + cellname[1];
		if (grid[col].length < 6) {
			grid[col].push(player_turn);
			row = 6 - grid[col].length;
		}

		return "" + row + col[3];




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
    	grid = {col0: [], col1: [], col2: [], col3: [], col4: [], col5: [], col6: []};
		$('.cell_p4').removeClass("cross circle is-disabled win loss").text("");
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

});