let canvas = document.getElementById('b');
let width = canvas.clientWidth;
let height = canvas.clientHeight;

let firstDist;
let secondDist;
let forceAtMiddle;
let numberOfDots = 1000;
let dots = [];
let tree;

let colors = [
	[255, 0, 80],
	[0, 250, 154],
	[0, 191, 255],
	[255, 255, 51],
	[144, 0, 255],
];

function getForceCoeficient(d) {
	let dist1 = firstDist.value();
	let dist2 = firstDist.value();
	let mid = dist1 + dist2 / 2;
	let end = dist1 + dist2;

	if (d < dist1) {
		return Utils.remap(d, 0, dist1, -1, 0);
	} else if (d <= mid) {
		return Utils.remap(d, dist1, mid, 0, forceAtMiddle.value());
	} else {
		return Utils.remap(d, mid, end, forceAtMiddle.value(), 0);
	}
}

class Dot {
	constructor(x, y, colorIndex) {
		this.pos = createVector(x, y);
		this.x = x;
		this.y = y;
		this.vel = createVector(0, 0);
		this.color = colors[colorIndex];
	}

	addVel(vel) {
		this.vel += vel;
	}

	update() {
		this.pos += this.vel;
		this.vel = createVector(0, 0);
		this.x = this.pos.x;
		this.y = this.pos.y;
	}

	show() {
		stroke(...this.color);
		strokeWeight(3);
		noFill();
		point(this.pos.x, this.pos.y);
	}
}

function setup() {
	createCanvas(width, height);
	firstDist = createSlider(0, 100, 1);
	firstDist.size(500);
	firstDist.position(10, 10);
	secondDist = createSlider(10, 1000, 100);
	secondDist.size(500);
	secondDist.position(10, 40);
	forceAtMiddle = createSlider(-1, 1, 1);
	forceAtMiddle.size(500);
	forceAtMiddle.position(10, 70);

	for (let i = 0; i < numberOfDots; i++) {
		dots.push(Dot(random(0, width), random(0, height), Math.floor(random() * 4)));
	}

	tree = QuadTree(0, 0, width, height);
}

function draw() {
	background(15, 15, 15);

	tree.clear();

	dots.forEach((dot) => {
		tree.insert(dot);
	});
}
