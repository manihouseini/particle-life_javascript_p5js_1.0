let canvas = document.getElementById('b');
let width = canvas.clientWidth;
let height = canvas.clientHeight;

let firstDist;
let secondDist;
let forceAtMiddle;
let maxEffectedDistance;
let maxForce = 2;
let numberOfDots = 1000;
let dotTypes = 3;
let dots = [];
let tree;

let colors = [
	[255, 0, 80],
	[0, 250, 154],
	[0, 191, 255],
	[255, 255, 51],
	[144, 0, 255],
];

// red, green, blue, purple, yellow
let mat = [
	[1, 0.6, 0, 0, 0],
	[-0.6, 1, 0.6, 0, 0],
	[0, -0.6, 1, 0.6, 0],
	[0, 0, -0.6, 1, 0.6],
	[0, 0, 0, -0.6, 1],
];

function getForceCoeficient(d) {
	let dist1 = firstDist.value();
	let dist2 = secondDist.value();
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
		this.colorIndex = colorIndex;
		this.color = colors[colorIndex];
	}

	addVel(v) {
		this.vel.add(v);
	}

	update() {
		this.vel.limit(maxForce * 10);
		this.pos.add(this.vel);
		this.vel = createVector(0, 0);
		this.x = this.pos.x;
		this.y = this.pos.y;
	}

	border() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
		if (this.y > height) {
			this.y = 0;
		} else if (this.y < 0) {
			this.y = height;
		}
	}

	show() {
		stroke(...this.color);
		strokeWeight(5);
		noFill();
		point(this.pos.x, this.pos.y);
	}

	showSelected() {
		stroke(255);
		strokeWeight(10);
		noFill();
		point(this.pos.x, this.pos.y);
	}
}

function setup() {
	createCanvas(width, height);
	firstDist = createSlider(0, 80, 20);
	firstDist.size(500);
	firstDist.position(10, 10);
	secondDist = createSlider(10, 350, 100);
	secondDist.size(500);
	secondDist.position(10, 40);
	forceAtMiddle = createSlider(-1, 1, 1, 0.01);
	forceAtMiddle.size(500);
	forceAtMiddle.position(10, 70);

	for (let i = 0; i < numberOfDots; i++) {
		dots.push(new Dot(random(0, width), random(0, height), Math.floor(random() * dotTypes)));
	}

	tree = new QuadTree(0, 0, width, height);
}

function draw() {
	background(15, 15, 15);

	tree.clear();

	dots.forEach((dot) => {
		tree.insert(dot);
	});

	maxEffectedDistance = firstDist.value() + secondDist.value();

	// region main
	dots.forEach((dot) => {
		let otherDots = tree.queryCircle(dot.x, dot.y, maxEffectedDistance);
		otherDots.forEach((other) => {
			if (dot != other) {
				let d = dist(dot.x, dot.y, other.x, other.y);
				if (d > firstDist.value()) {
					let coeficient = getForceCoeficient(d);
					let dir = createVector(other.x - dot.x, other.y - dot.y);
					dir.normalize();
					dir.mult(coeficient);
					dir.mult(maxForce);

					let colorCoeficient = mat[dot.colorIndex][other.colorIndex];
					dir.mult(colorCoeficient);

					dot.addVel(dir);
				} else {
					let coeficient = getForceCoeficient(d);
					let dir = createVector(other.x - dot.x, other.y - dot.y);
					dir.normalize();
					dir.mult(coeficient);
					dir.mult(maxForce);

					dot.addVel(dir);
				}
			}
		});
	});

	dots.forEach((dot) => {
		dot.update();
		dot.border();
	});
	// endregion

	dots.forEach((dot) => {
		dot.show();
	});

	// region test
	// let selected = tree.queryCircle(mouseX, mouseY, maxEffectedDistance);
	// tree.show();
	// selected.forEach((dot) => {
	// 	dot.showSelected();
	// });
	// endregion
}
