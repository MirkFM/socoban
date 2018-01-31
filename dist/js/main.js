(function(){
	window.addEventListener("gameOver", function() {
		var msg = document.querySelector('.s-menu__msg');
		msg.style.opacity = 1;
	}, false);

	window.addEventListener("gameUpdate", function(e) {
		var point = document.querySelector('#game-point');
		point.innerHTML = e.detail.point;
	}, false);
})();