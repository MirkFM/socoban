// (function(){
	// var map = [
	// 	[0, 0, 7, 7, 7, 7, 0],
	// 	[7, 7, 7, 0, 0, 7, 0],
	// 	[7, 0, 5, 0, 1, 7, 7],
	// 	[7, 0, 5, 0, 0, 0, 7],
	// 	[7, 3, 7, 1, 0, 0, 7],
	// 	[7, 7, 7, 7, 7, 7, 7]
	// ];

	
// 	// var j = map[0].length;

// 	var html_map = document.querySelector('.s-map');

// 	var oline = document.createElement('div');
// 	oline.className = 's-map__line';
// 	var ocell = document.createElement('div');
// 	ocell.className = 's-map__cell';
// 	var owall = document.createElement('div');
// 	owall.className = 's-map__wall';
// 	var obox = document.createElement('div');
// 	obox.className = 's-map__box';
// 	var ocase = document.createElement('div');
// 	ocase.className = 's-map__case';
// 	var oloader = document.createElement('div');
// 	oloader.className = 's-map__loader';

// 	for (var i = 0, max_i = map.length; i < max_i; i++) {
// 		var line = oline.cloneNode(false);

// 		for (var j = 0, max_j = map[i].length; j < max_j; j++) {
// 			var cell = ocell.cloneNode(false);
// 			var obj = '';

// 			switch (map[i][j]) {
// 				case 1:
// 					obj = ocase.cloneNode(false);
// 					break;
// 				case 3:
// 					obj = oloader.cloneNode(false);
// 					break;
// 				case 5:
// 					obj = obox.cloneNode(false);
// 					break;
// 				case 7:
// 					obj = owall.cloneNode(false);
// 					break;
// 				default:
// 					obj = '';
// 			}

// 			if (obj) {
// 				cell.appendChild(obj);
// 			}

// 			line.appendChild(cell);
// 		}

// 		html_map.appendChild(line);
// 	}


// 	// html_map.innerHTML = 

// 	window.addEventListener('keydown', function(e) {
// 		switch (e.keyCode) {
// 			case 37:
// 				console.log('left');
// 				break;
// 			case 38:
// 				console.log('up');
// 				break;
// 			case 39:
// 				console.log('right');
// 				break;
// 			case 40:
// 				console.log('down');
// 				break;
// 			default:
// 		}
// 	});
// })();

// (function(){
// 	var step = (function(){
// 		var count = 0;

// 		return function (num) {
// 			count = num !== undefined ? num : count;
// 			return count++;
// 		}

// 	}());

// 	console.log( step() );
// 	console.log( step() );
// 	console.log( step() );
// 	console.log( step() );
// 	console.log( step() );
// // });

// var Person = {
// 	constructor: function(name, age, gender) {
// 		this.name = name,
// 		this.age = age,
// 		this.gender = gender;

// 		return this;
// 	},
// 	greet: function() {
// 		console.log("Hi, my name is " + this.name);
// 	}
// }

// var person, anotherPerson, thirdPerson;


// person = Object.create(Person).constructor("John", 35, 'male');
// anotherPerson = Object.create(Person).constructor('Jessics', 28, 'female');
// thirdPerson = Object.create(Person).constructor('Bruce', 38, 'male');

// person.greet();


// function Sokoban() {
// 	var counter = 0;

// 	this.step = function () {
// 		return counter++;
// 	}
// }

// var sokoban = new Sokoban;

// console.log(sokoban.step());
// console.log(sokoban.step());
// console.log(sokoban.step());


// var myGame = (function(){

// 	var i = 0;



// 	return {
// 		method: i
// 	};
// }());
