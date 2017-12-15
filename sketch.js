var socket;

function setup() {
	createCanvas(900, 900);
	background(51);

	socket = io.connect('http://zaitsev.jside.ru:30000');
	socket.on('mouse', newDrawing);
}

function newDrawing(data) {
	noStroke();
	fill(255, 0, 100);
	ellipse(data.x, data.y, 40, 40);
}

function mouseMoved() {

	console.log('Sending: ' + mouseX + ', ' + mouseY);

	var data = {
		x: mouseX,
		y: mouseY
	}

	socket.emit('mouse', data);
}

function draw() {
	noStroke();
	fill(255);
	ellipse(mouseX, mouseY, 40, 40);
}