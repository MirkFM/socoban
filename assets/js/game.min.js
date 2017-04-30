(function(){
	/* constants */
	var VOID = 0,
		CASE = 1,
		LOADER = 3,
		BOX = 5,
		WALL = 7,
		CASE_BOX = CASE + BOX,
		CASE_LOADER = CASE + LOADER,
		STEPX = 50,
		STEPY = 50,
		CLASSPREFIX = 's-map';

	var socoban, type,
		map = [
			[0, 0, 7, 7, 7, 7, 0],
			[7, 7, 7, 0, 0, 7, 0],
			[7, 0, 5, 0, 1, 7, 7],
			[7, 0, 5, 0, 0, 0, 7],
			[7, 3, 7, 1, 0, 0, 7],
			[7, 7, 7, 7, 7, 7, 7]
		];


	Game = function() {
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
		var _ = this;

		if (typeof(_.historyStep[y]) == 'undefined') {
			_.historyStep[y] = {};
		}

		_.historyStep[y][x] = value;
	};

	Game.prototype.updateHistory = function() {
		var _ = this;
		_.history.push(_.historyStep);
	};

	Game.prototype.updateViewChange = function(x, y, value) {
		var _ = this;

		if (typeof(_.viewChange[y]) == 'undefined') {
			_.viewChange[y] = {};
		}

		_.viewChange[y][x] = value;
	};

	Game.prototype.updateView = function() {
		var line, cell, type, i, max_i, k, max_k, x, y,
			html_map = document.querySelector('.' + CLASSPREFIX),
			_ = this;

		for (y in _.viewChange) {
			line = html_map.querySelectorAll('.' + CLASSPREFIX +'__line')[y];

			for(x in _.viewChange[y]) {
				cell = line.querySelectorAll('.' + CLASSPREFIX +'__cell')[x];
				cell.innerHTML = '';

				type = _.getElementType(_.viewChange[y][x], x, y);

				for (k = 0, max_k = type.length; k < max_k; k++) {
					cell.appendChild(_.getElementView(type[k]));
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
		var event,
			_ = this,
			val = _.map[y][x];

		if (val === CASE && diff === BOX) {
			_.point--;
		} else if (val === CASE_BOX) {
			_.point++;
		}

		_.map[y][x] = val + diff;
		_.updateViewChange(x, y, _.map[y][x]);

		updateGame(_.point);
	};

	Game.prototype.updateMap = function() {
		var val, new_val,
			_ = this;

		for (y in _.viewChange) {
			for (x in _.viewChange[y]) {
				val = _.map[y][x];
				new_val = _.viewChange[y][x];

				if (val === CASE && new_val === CASE_BOX) {
					_.point--;
				} else if (val === CASE_BOX && new_val !== CASE_BOX) {
					_.point++;
				}
				_.map[y][x] = new_val;
			}
		}

		updateGame(_.point);
	};

	Game.prototype.change = function(vector) {
		var _ = this,
			x = Number(_.active.x),
			y = Number(_.active.y);

		_.historyStep = {};
		_.viewChange = {};

		_.updateHistoryStep(x, y, _.map[y][x]);
		/* view next point */
		x = x + Number(vector[0]);
		y = y + Number(vector[1]);
		point = _.map[y][x];

		if ( (point === VOID) || (point === CASE) ) {
			_.updateHistoryStep(x, y, point);
			_.move(vector, x, y);
		} else if ( (point === BOX) || (point === CASE_BOX) ) {
			/* view following next point */
			_.updateHistoryStep(x, y, point);
			x = x + Number(vector[0]);
			y = y + Number(vector[1]);
			point = _.map[y][x];

			if ( (point === VOID) || (point === CASE) ) {
				_.updateHistoryStep(x, y, point);
				_.push(vector, x, y);
			}
		}
	};

	Game.prototype.over = function() {
		var event,
			_ = this;

		_.finish = 1;
		
		event = new CustomEvent("gameOver");
		window.dispatchEvent(event);
	};

	/* move loader */
	Game.prototype.move = function(vector, x, y) {
		var _ = this;

		/* add loader from new point */
		_.updateCell(x, y, LOADER);

		/* update loader coords */
		_.active.x = x;
		_.active.y = y;

		/* delete loader from old point */
		x = x - Number(vector[0]);
		y = y - Number(vector[1]);
		_.updateCell(x, y, -LOADER);

		
		_.updateView();
		_.updateHistory();
	};

	/* move loader && push box */
	Game.prototype.push = function(vector, x, y) {
		var _ = this;

		/* add box from new point */
		_.updateCell(x, y, BOX);

		/* delete box from new point */
		x = x - vector[0];
		y = y - vector[1];
		_.updateCell(x, y, -BOX);

		/* move loader */
		_.move(vector, x, y);

		if (!_.point) {
			_.over();
		}
	};

	Game.prototype.getElementType = function(value, x, y) {
		var elem_type,
			_ = this;

		switch (value) {
			case CASE:
				elem_type = ['case'];
				break;
			case LOADER:
				elem_type = ['loader'];
				_.active.x = x;
				_.active.y = y;
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
				_.active.x = x;
				_.active.y = y;
				break;
			default:
				elem_type = [];
		}

		return elem_type;
	};

	Game.prototype.init = function (map_array) {
		var i, j, k, max_i, max_j, max_k, elem, type, line, oline, cell, ocell, view, map,
			html_map = document.querySelector('.' + CLASSPREFIX),
			_ = this;

		_.map = map_array;
		oline = document.createElement('div');
		oline.className = CLASSPREFIX +'__line';
		ocell = document.createElement('div');
		ocell.className = CLASSPREFIX +'__cell';

		for (i = 0, max_i = _.map.length; i < max_i; i++) {
			line = oline.cloneNode(false);

			for (j = 0, max_j = _.map[i].length; j < max_j; j++) {
				elem = _.map[i][j];
				type = _.getElementType(elem, j, i);
				cell = ocell.cloneNode(false);

				if (elem === CASE || elem === CASE_LOADER) {
					_.point++;
					updateGame(_.point);
				}

				for (k = 0, max_k = type.length; k < max_k; k++) {
					cell.appendChild(_.getElementView(type[k]));
				}

				line.appendChild(cell);
			}

			html_map.appendChild(line);
		}

		window.addEventListener('keydown', function(e) {
			if (!_.finish) {
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
							var step = _.history.pop();

							if (step) {
								_.viewChange = step;
								_.updateMap();
								_.updateView(true);
							}
							break;
						}

					default:
						vector = null;
				}

				if (vector) {
					_.change(vector);
				}
			}
		});
	};

	function updateGame(point) {
		event = new CustomEvent("gameUpdate", {
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