//Creating the first layer of the array
var grid = new Array(20);
var cellCounter = 0;
//Generation counter
var generation = 0;
//Get the table to which all of the visuals will be written to
var table = $("#projectSpace");

//Create the second layer of arrays - each item is an array itself for the matrix
for(var i=0;i<20;i++) {
	grid[i] = new Array(20);
}
//By default, all of the cells are instantiated as dead ones - populated later with the configuration options
//Function used to clear the board when the user enters seed number
var clearCells = function() {
	for(var i=0;i<20;i++) {
		for(var j=0;j<20;j++) {
			grid[i][j] = grid[i][j] = new Cell(i,j,"false");
		}
	}
}

//Initialize the buttons
$(document).ready(function() {
	initButtons();
});
var initButtons = function() {
	var buttons = $("button");
	//Configure the grid with a random arrangement of live cells - number specified by the user
	$(buttons[0]).click(function() {
		cellCounter = $("input").val();
		clearCells();
		clearGrid();
		initHabitat();
		drawGrid();
	});
	//Start the game - interval is 1.5 seconds
	$(buttons[1]).click(function() {
		var startGame = setInterval(function(){
			playGeneration();
		},1500);
		//Stop button will stop game when pressed
		//Had to be nested in order to access the startGame variable
		$(buttons[2]).click(function() {
			clearInterval(startGame);	
		});
	});
	//Only react to play button click when the cell counter is non zero (set by user)

}
//The cell constructor - oh the fun times begin with this one
//x            --> The x-coordinate of the cell
//y            --> The y-coordinate of the cell
//isAlive 	   --> The status of the cell, dead or alive - used a boolean here
//getNeighbors --> The method to calculate all of the neighbors per cell
function Cell(x,y,isAlive) {
	//Assigning all of the values when creating the cell
	this.x = x;
	this.y = y;
	this.isAlive = isAlive;
	//The beauty of the whole visualization
	this.getNeighbors = function() {
		//Inner variable to keep track of all of the neighbors
		var totalNeighbors=0;
		//Below is a map of the relative coordinates to the current cell - taken as the point of origin
		//(-1,-1) (0,-1) (1,-1)
		//(-1,0)  (0,0)  (1,0)
		//(-1,1)  (0,1)  (1,1)

		//Check left cell
		if(this.x>0) {
			if(grid[this.x-1][this.y].isAlive=="true") {
				totalNeighbors++;
			}
		}

		//Check right cell
		if(this.x<19) {
			if(grid[this.x+1][this.y].isAlive=="true") {
				totalNeighbors++;
			}
		}

		//Check top cell
		if(this.y>0) {
			if(grid[this.x][this.y-1].isAlive=="true") {
				totalNeighbors++;
			}
		}

		//Check bottom cell
		if(this.y<19) {
			if(grid[this.x][this.y+1].isAlive=="true") {
				totalNeighbors++;
			}
		}

		//Check (-1,-1)
		if(this.x>0 && this.y>0) {
			if(grid[this.x-1][this.y-1].isAlive=="true") {
				totalNeighbors++;
			}
		}

		//Check (1,1)
		if(this.x<19 && this.y<19) {
			if(grid[this.x+1][this.y+1].isAlive=="true") {
				totalNeighbors++;
			}
		}
		//Return the number of neighbors to the calling function/context
		return totalNeighbors;
	}
}
//Initialize the habitat - using a random method of insertion
var initHabitat = function() {
	for(var i=cellCounter;i>0;) {
		var x = parseInt(Math.random()*20);
		var y = parseInt(Math.random()*20);
		if(grid[x][y].isAlive!="true") {
			grid[x][y] = new Cell(x,y,"true");
			i--;
		} else {
			x = parseInt(Math.random()*20);
			y = parseInt(Math.random()*20);
		}
	}
}
//Draw the grid by printing all of values into the table
var drawGrid = function() {
	var tempGrid = document.getElementById("projectSpace");
	for (var y = 0; y < 20; y++) {
		var row = tempGrid.insertRow(-1);
		for (var x = 0; x < 20; x++) {
			var cell = row.insertCell(-1);
			cell.innerHTML = "&nbsp;";
			cell.isAlive = grid[y][x].isAlive;
		}
	}
var currentCells = $("td");
	for(var i=0;i<currentCells.length;i++) {
		if(currentCells[i].isAlive=="true") {
			$(currentCells[i]).css("background-color","#059B9A");
		} else {
			$(currentCells[i]).css("background-color","#454857");
		}
	}
}

//One generation iteration
//1 --> Clear the grid
//2 --> Draw the grid
//3 --> Process each cell to find out how many neighbors it has
//4 --> Clear the grid again after processing
//5 --> Draw the grid again with the new cell states
//6 --> Increment the generation counter, started at 0 initially
var playGeneration = function() {
	clearGrid();
	drawGrid();
	processCells();
	clearGrid();
	drawGrid();
	generation++;
	$("p.genCounter").text(generation)
}
//The function to process the cells- rules cited from Wikipedia:
//1 --> Any live cell with fewer than two live neighbours dies, as if caused by under-population.
//2 --> Any live cell with two or three live neighbours lives on to the next generation.
//3 --> Any live cell with more than three live neighbours dies, as if by overcrowding.
//4 --> Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
var processCells = function() {
	for(var i=0;i<20;i++) {
		for(var j=0;j<20;j++) {
			//Implementation of rule 1
			if(grid[i][j].isAlive=="true" && grid[i][j].getNeighbors()<2) {
				grid[i][j].isAlive="false";
			//Implementation of rule 3	
			} else if(grid[i][j].isAlive=="true" && grid[i][j].getNeighbors()>3) {
				grid[i][j].isAlive="false";
			//Implementation of rule 4	
			} else if(grid[i][j].isAlive=="false" && grid[i][j].getNeighbors()==3) {
				grid[i][j].isAlive="true";
			//Implementation of rule 2	
			} else if(grid[i][j].isAlive=="true" && (grid[i][j].getNeighbors()==2 || grid[i][j].getNeighbors()==3)) {
				grid[i][j].isAlive="true";
			}
		}
	}
}
//Clear the grid using the built-in jQuery empty() method
var clearGrid = function() {
	$(table).empty();
}