
$(document).ready(function() {

	//keeps track who's turn it is to play
	var player_turn = 1;
	//number of moves played
	var turns = 0;

	var player1 = {name: "Player1", symbol: "circle", score: 0};
	var player2 = {name: "Player2", symbol: "cross", score: 0};
	grid = {col0: [], col1: [], col2: [], col3: [], col4: [], col5: [], col6: []};
	
	var winindex = 0;
	var wincurcellright = 0;
	var wincurcellleft = 0;
	var gridrow = {row0: [0,0,0,0,0,0,0], row1: [0,0,0,0,0,0,0],
				   row2: [0,0,0,0,0,0,0], row3: [0,0,0,0,0,0,0], 
				   row4: [0,0,0,0,0,0,0], row5: [0,0,0,0,0,0,0]};

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
		playTurn_p4($(this), cell);
	});


	$('#reset_grid').on('click', function() {
		resetGrid_p4();
	});
    
    $('#reset_score').on('click', function() {
        resetScore();
    });


    //Main game function. 
    function playTurn_p4(cell, cellname) {
		
		if (cell.hasClass('is-disabled')) {
			return;
		}


		cellname = getGoodCell(cell, cellname);


		cell = $('#' + cellname);




		cell.addClass(changeCellState());
		//alterGrid(cellname, changeCellState());
		cell.addClass('is-disabled');
		turns += 1;

		if (turns > 6) {
			if (win_p4(cellname) == true) {
				console.log("WIN!");
				$('#score').text("Winner"); 
				increaseScore();
				$('.cell_p4').addClass("is-disabled");
	            markLoss();

			}// } else if (draw()) {
			// 	$('#score').text("Draw");
	  //           markLoss();
			// }
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

	function getGoodCell(cell, cellname) {
		var row = cellname[0];
		var col = "col" + cellname[1];
		if (grid[col].length < 6) {
			grid[col].push(player_turn);
			row = 6 - grid[col].length;
			gridrow['row' + row][cellname[1]] = player_turn;
		}

		return "" + row + col[3];




	}

				// gridrow[rowgrid][cellname[1]] = player_turn; // ROWGRID
			// // console.log("grid: " + grid[col].length);
			// // console.log("gridrow length: " + fourInARow(grid[col]));

	//Adds class to newly filled cell
	function changeCellState() {
		return player_turn == 1 ? "circle" : "cross";
	}

	//Updates grid object
	function alterGrid(cell, state) {
		grid[cell] = state;
	}
    
    function resetGrid_p4() {
    	grid = {col0: [], col1: [], col2: [], col3: [], col4: [], col5: [], col6: []};
    	gridrow = {row0: [0,0,0,0,0,0,0], row1: [0,0,0,0,0,0,0],
				   row2: [0,0,0,0,0,0,0], row3: [0,0,0,0,0,0,0], 
				   row4: [0,0,0,0,0,0,0], row5: [0,0,0,0,0,0,0]};
		winindex = 0;
		wincurcellleft = 0;
		wincurrcellight = 0;
		$('.cell_p4').removeClass("cross circle is-disabled win loss").text("");
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
        $('.cell_p4').not('.win').addClass('loss');
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

    function win_p4(cellname) {
    	return winRow(cellname) || winCol(cellname) || winDiago(cellname);
    }

    function winRow(cellname) {
    	var row = "row" + cellname[0];
    	var col = "col" + cellname[1];
    	var r = cellname[0];
    	var c = cellname[1];
    	var i;
  		if (fourInARow(gridrow[row])) {
    		$('#' + r + winindex).addClass('win');
    		for (i = winindex; i > winindex - 4; i--) {
    			$('#' + r + i).addClass('win');
    		}
    		return true;
    	}
    	return false;
    }

    function winCol(cellname) {
    	var col = "col" + cellname[1];
    	var r = cellname[0];
    	var c = cellname[1];
    	var i;
    	if (fourInARow(grid[col])) {
    		$('#' + (5-winindex) + c).addClass('win');
    		for (i = 5-winindex; i < 5-winindex + 4; i++) {
    			$('#' + i + c).addClass('win');
    		}
    		return true;
    	}
    	return false;
    }

    function winDiago(cellname) {
    	var diagoL = getDiagoLeft(cellname);
    	var diagoR = getDiagoRight(cellname);
    	var r = cellname[0];
    	var c = cellname[1];
    	if (fourInARow(diagoL)) {
    		var i = winindex-wincurcellleft;
    		var j;
    		for (j = 0; j < 4; j++) {
    			$('#' + (parseInt(r)+i) + (parseInt(c)+i)).addClass('win');
    			i--;
    		}
    	} else if (fourInARow(diagoR)) {
    		var i = winindex-wincurcellright;
    		var j;
    		for (j = 0; j < 4; j++) {
    			$('#' + (parseInt(r)+i) + (parseInt(c)-i)).addClass('win');
    			i--;
    		}

    	} else {
    		return false;
    	}
    	return true;
    }

    function getDiagoLeft(cellname) {
    	var diagonal= [];
    	var r = cellname[0];
    	var c = cellname[1];
    	var maxr = 5;
    	var maxc = 6;
    	var topleft = Math.min(r, c);
    	wincurcellleft = topleft;
    	var initr = r - topleft;
    	var initc = c - topleft;
    	// console.log("initr: " + initr);
    	// console.log("initc: " + initc);

    	while (initr <= maxr && initc <= maxc) {
    		diagonal.push(getCellState(initr,initc));
    		initr++;
    		initc++;
    	}
    	console.log("diagonal: " + diagonal);
    	return diagonal; 
    }

    function getDiagoRight(cellname) {
    	var diagonal= [];
    	var r = cellname[0];
    	var c = cellname[1];
    	var maxr = 5;
    	var maxc = 0;
    	var topright = Math.min(r, ( 6 - parseInt(c)));
    	wincurcellright = topright;
    	var initr = r - topright;
    	var initc = parseInt(c) + topright;
    	// console.log("c: " + c);
    	// console.log("initc: " + initc);

    	while (initr <= maxr && initc >= maxc) {
    		diagonal.push(getCellState(initr,initc));
    		initr++;
    		initc--;
    	}
    	// console.log("diagonal: " + diagonal);
    	return diagonal; 
    }

    function getCellState(r,c) {
    	var state;
    	var row  = "row" + r;
    	// console.log("row: " + row);
    	// console.log("c: " + c);
    	// console.log("gridrow: " + gridrow[row]);
    	state = gridrow[row][c];
    	return state;
    }

    function fourInARow(l) {
    	// console.log("l: " + l);
    	if (l.length == 0) {
    		return false;
    	}

    	var current = l[0];
    	var count = 1;
    	var i;
    	for (i = 1; i < l.length; i++) {
    		// console.log("curr: " + current);	
    		if (current == 0) {
    			count = 1;
    			current  = l[i];
    			continue;
    		}
    		if (current == l[i]) {
    			count++;
    			if (count == 4) {
	    			winindex = i;
	    			// console.log("winindex: " + winindex);
	    			return true;
    			}
    		} else {
    			count = 1;
    		}

    		current  = l[i];
    	}
    	// console.log(l);
    	// console.log("count: " + count);
    	return count == 4;
    } 

});
