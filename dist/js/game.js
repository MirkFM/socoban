(function(){
	/* constants */
	var VOID = 0,
		CASE = 1,
		LOADER = 3,
		BOX = 5,
		WALL = 7,
		CASE_BOX = CASE + BOX,
		CASE_LOADER = CASE + LOADER,
		CLASSPREFIX = 's-map';

	var socoban,
		map = [
			[0, 0, 7, 7, 7, 7, 0],
			[7, 7, 7, 0, 0, 7, 0],
			[7, 0, 5, 0, 1, 7, 7],
			[7, 0, 5, 0, 0, 0, 7],
			[7, 3, 7, 1, 0, 0, 7],
			[7, 7, 7, 7, 7, 7, 7]
		];


	var Game = function() {
		this.finish = 0;
		this.step = 0;
		this.point = 0;
		this.active = {
			x: 0,
			y: 0
		};
		this.map = [];
		this.history = [];
		this.historyStep = {};
		this.viewChange = {};
	};

	Game.prototype.updateHistoryStep = function(x, y, value) {
		if (typeof(this.historyStep[y]) == 'undefined') {
			this.historyStep[y] = {};
		}

		this.historyStep[y][x] = value;
	};

	Game.prototype.updateHistory = function() {
		this.history.push(this.historyStep);
	};

	Game.prototype.updateViewChange = function(x, y, value) {
		if (typeof(this.viewChange[y]) == 'undefined') {
			this.viewChange[y] = {};
		}

		this.viewChange[y][x] = value;
	};

	Game.prototype.updateView = function() {
		var line, cell, type, k, maxK, x, y,
			htmlMap = document.querySelector('.' + CLASSPREFIX);

		for (y in this.viewChange) {
			line = htmlMap.querySelectorAll('.' + CLASSPREFIX +'__line')[y];

			for(x in this.viewChange[y]) {
				cell = line.querySelectorAll('.' + CLASSPREFIX +'__cell')[x];
				cell.innerHTML = '';

				type = this.getElementType(this.viewChange[y][x], x, y);

				for (k = 0, maxK = type.length; k < maxK; k++) {
					cell.appendChild(this.getElementView(type[k]));
				}
			}
		}
	};

	Game.prototype.getElementView = function(type) {
		var view = document.createElement('div');

		view.className = CLASSPREFIX + '__' + type;

		return view;
	};

	Game.prototype.updateCell = function(x, y, diff) {
		var val = this.map[y][x];

		if (val === CASE && diff === BOX) {
			this.point--;
		} else if (val === CASE_BOX) {
			this.point++;
		}

		this.map[y][x] = val + diff;
		this.updateViewChange(x, y, this.map[y][x]);

		updateGame(this.point);
	};

	Game.prototype.updateMap = function() {
		var val, new_val, x, y;

		for (y in this.viewChange) {
			for (x in this.viewChange[y]) {
				val = this.map[y][x];
				new_val = this.viewChange[y][x];

				if (val === CASE && new_val === CASE_BOX) {
					this.point--;
				} else if (val === CASE_BOX && new_val !== CASE_BOX) {
					this.point++;
				}
				this.map[y][x] = new_val;
			}
		}

		updateGame(this.point);
	};

	Game.prototype.change = function(vector) {
		var point,
			x = Number(this.active.x),
			y = Number(this.active.y);

		this.historyStep = {};
		this.viewChange = {};

		this.updateHistoryStep(x, y, this.map[y][x]);
		/* view next point */
		x = x + Number(vector[0]);
		y = y + Number(vector[1]);
		point = this.map[y][x];

		if ( (point === VOID) || (point === CASE) ) {
			this.updateHistoryStep(x, y, point);
			this.move(vector, x, y);
		} else if ( (point === BOX) || (point === CASE_BOX) ) {
			/* view following next point */
			this.updateHistoryStep(x, y, point);
			x = x + Number(vector[0]);
			y = y + Number(vector[1]);
			point = this.map[y][x];

			if ( (point === VOID) || (point === CASE) ) {
				this.updateHistoryStep(x, y, point);
				this.push(vector, x, y);
			}
		}
	};

	Game.prototype.over = function() {
		var event;

		this.finish = 1;
		
		event = new CustomEvent("gameOver");
		window.dispatchEvent(event);
	};

	/* move loader */
	Game.prototype.move = function(vector, x, y) {
		/* add loader from new point */
		this.updateCell(x, y, LOADER);

		/* update loader coords */
		this.active.x = x;
		this.active.y = y;

		/* delete loader from old point */
		x = x - Number(vector[0]);
		y = y - Number(vector[1]);
		this.updateCell(x, y, -LOADER);

		
		this.updateView();
		this.updateHistory();
	};

	/* move loader && push box */
	Game.prototype.push = function(vector, x, y) {
		/* add box from new point */
		this.updateCell(x, y, BOX);

		/* delete box from new point */
		x = x - vector[0];
		y = y - vector[1];
		this.updateCell(x, y, -BOX);

		/* move loader */
		this.move(vector, x, y);

		if (!this.point) {
			this.over();
		}
	};

	Game.prototype.getElementType = function(value, x, y) {
		var elem_type;

		switch (value) {
			case CASE:
				elem_type = ['case'];
				break;
			case LOADER:
				elem_type = ['loader'];
				this.active.x = x;
				this.active.y = y;
				break;
			case BOX:
				elem_type = ['box'];
				break;
			case WALL:
				elem_type = ['wall'];
				break;
			case CASE_BOX:
				elem_type = ['case_box'];
				break;
			case CASE_LOADER:
				elem_type = ['case', 'loader'];
				this.active.x = x;
				this.active.y = y;
				break;
			default:
				elem_type = [];
		}

		return elem_type;
	};

	Game.prototype.init = function (map_array) {
		var i, j, k, maxI, max_j, maxK, elem, type, line, oLine, cell, oCell,
			htmlMap = document.querySelector('.' + CLASSPREFIX),
			self = this;

		self.map = map_array;
		oLine = document.createElement('div');
		oLine.className = CLASSPREFIX +'__line';
		oCell = document.createElement('div');
		oCell.className = CLASSPREFIX +'__cell';

		for (i = 0, maxI = self.map.length; i < maxI; i++) {
			line = oLine.cloneNode(false);

			for (j = 0, max_j = self.map[i].length; j < max_j; j++) {
				elem = self.map[i][j];
				type = self.getElementType(elem, j, i);
				cell = oCell.cloneNode(false);

				if (elem === CASE || elem === CASE_LOADER) {
					self.point++;
					updateGame(self.point);
				}

				for (k = 0, maxK = type.length; k < maxK; k++) {
					cell.appendChild(self.getElementView(type[k]));
				}

				line.appendChild(cell);
			}

			htmlMap.appendChild(line);
		}

		window.addEventListener('keydown', function(e) {
			var vector;

			if (!self.finish) {
				switch (e.keyCode) {
					/* direction left */
					case 37:
						vector = [-1, 0];
						break;

					/* direction up */
					case 38:
						vector = [0, -1];
						break;

					/* direction right */
					case 39:
						vector = [1, 0];
						break;

					/* direction down */
					case 40:
						vector = [0, 1];
						break;

					case 90:
						/* return back */
						if (e.ctrlKey) {
							vector = null;
							var step = self.history.pop();

							if (step) {
								self.viewChange = step;
								self.updateMap();
								self.updateView(true);
							}
						}
						break;

					default:
						vector = null;
				}

				if (vector) {
					self.change(vector);
				}
			}
		});
	};

	function updateGame(point) {
		var event = new CustomEvent("gameUpdate", {
			detail: {
				point: point
			}
		});
		window.dispatchEvent(event);
	}

	socoban = new Game();
	socoban.init(map);
})();



try {
	new CustomEvent("IE has CustomEvent, but doesn't support constructor");
} catch (e) {
	window.CustomEvent = function(event, params) {
		var evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = Object.create(window.Event.prototype);
}