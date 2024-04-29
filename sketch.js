class circularBuffer {
  constructor(size){
    this.size = size;
    this.buffer = new Array(size);
    this.index = 0;
  }

  push(value){
    this.buffer[this.index] = value;
    this.index = mod(this.index + 1, this.size);
  }

  get(index){
    return this.buffer[mod((this.index - 1 - index), this.size)];
  }

  clear(){
    this.buffer = new Array(this.size);
    this.index = 0;
  }
}

let d = 200; // in cm distance between the two pendulums
let l = 200; // in cm length of the pendulums
let g = 9.8; // gravity
let k = 10; // spring constant
let m = 10; // mass of both pendulums

let circ_buffer_size = 500;
let past_theta = new circularBuffer(circ_buffer_size);
let past_phi = new circularBuffer(circ_buffer_size);

let theta0 = 0; // initial angle of the first pendulum (in radians)
let theta_dot0 = 0; // initial angular velocity of the first pendulum (in radians/s)
let phi0 = 0; // initial angle of the second pendulum (in radians)
let phi_dot0 = 0; // initial angular velocity of the second pendulum (in radians/s)

let w1; // oscillation frequency on the first normal mode (both same direction)
let w2; // oscillation frequency on the second normal mode (opposite direction)
let A1;
let A2;
let o1;
let o2;
let t = 0;
let theta, phi;

let thetaSlider, thetaDotSlider, phiSlider, phiDotSlider;
let kTextBox, gTextBox, lTextBox;
let startButton, stopButton;
let isRunning = false;

function setup() {
  createCanvas(700, 700);

  // Create sliders
  thetaSlider = createSlider(-PI/6, PI/6, 0, 0.01);
  thetaSlider.position(10, 10);
  thetaDotSlider = createSlider(-10, 10, 0, 0.1);
  thetaDotSlider.position(10, 30);
  phiSlider = createSlider(-PI/6, PI/6, 0, 0.01);
  phiSlider.position(10, 50);
  phiDotSlider = createSlider(-10, 10, 0, 0.1);
  phiDotSlider.position(10, 70);

  // Create text boxes
  kTextBox = createInput(k.toString());
  kTextBox.position(10, 90);
  kTextBox.size(30);
  gTextBox = createInput(g.toString());
  gTextBox.position(10, 110);
  gTextBox.size(30);
  lTextBox = createInput(l.toString());
  lTextBox.position(10, 130);
  lTextBox.size(30);

  // Create buttons
  startButton = createButton('Start');
  startButton.position(200, 105);  
  startButton.mousePressed(startSimulation);
  stopButton = createButton('Stop');
  stopButton.position(200, 125);
  stopButton.mousePressed(stopSimulation);
}

function draw() {
  background(220);
  
  if (isRunning) {
    past_theta.push(theta);
    past_phi.push(phi);
    // Calculate pendulum positions
    theta = (A1 * sin(w1 * t + o1) + A2 * sin(w2 * t + o2));
    phi = (A1 * sin(w1 * t + o1) - A2 * sin(w2 * t + o2));
    t += 0.01;
  } else{
    // Update parameters
    k = parseFloat(kTextBox.value());
    g = parseFloat(gTextBox.value());
    l = parseFloat(lTextBox.value());
    // Update starting conditions based on sliders
    theta0 = thetaSlider.value();
    theta_dot0 = thetaDotSlider.value();
    phi0 = phiSlider.value();
    phi_dot0 = phiDotSlider.value();

    theta = theta0;
    phi = phi0;

    // show thetha_dot0 and phi_dot0 with arrows
    stroke("blue");
    drawArrow((width-d)/2 + l * sin(theta), height/2 + l * cos(theta), (width-d)/2 + l * sin(theta) + theta_dot0 *100* cos(theta), height/2 + l * cos(theta) - theta_dot0 *100* sin(theta));
    drawArrow((width+d)/2 + l * sin(phi), height/2 + l * cos(phi), (width+d)/2 + l * sin(phi) + phi_dot0 *100* cos(phi), height/2 + l * cos(phi) - phi_dot0 *100* sin(phi));
  }

  // Draw configuration space
  drawConfigurationSpace(theta, phi);
  // Draw pendulums
  drawPendulums(theta, phi);
  // Draw spring
  drawSpring((width - d)/2 + l * sin(theta), height/2 + l * cos(theta), (width + d)/2 + l * sin(phi), height/2 + l * cos(phi));
  // add text
  fill(0);

  text("Theta: " + round(theta0 *180/PI * 100) / 100 + " deg", thetaSlider.x + thetaSlider.width + 10, thetaSlider.y + 15);
  text("Theta Dot: " + round(theta_dot0 *180/PI * 100) / 100 + " deg/s", thetaDotSlider.x + thetaDotSlider.width + 10, thetaDotSlider.y + 15);
  text("Phi: " + round(phi0 *180/PI * 100) / 100 + " deg", phiSlider.x + phiSlider.width + 10, phiSlider.y + 15);
  text("Phi Dot: " + round(phi_dot0 *180/PI * 100) / 100 + " deg/s", phiDotSlider.x + phiDotSlider.width + 10, phiDotSlider.y + 15);  
  text("Spring Constant (N/m)", kTextBox.x + 40, kTextBox.y+15);
  text("Gravity (m/s^2)", gTextBox.x + 40, gTextBox.y+15);
  text("Length of pendulum (cm)", lTextBox.x + 40, lTextBox.y+15);
}

function startSimulation() {
  // calculate equation parameters
  w1 = sqrt(100 * g / l);
  w2 = sqrt((100 * g / l) + (2 * k / m));

  A1 = sqrt((theta0 + phi0)**2 / 4 + (theta_dot0 + phi_dot0)**2 / (4 * w1**2));
  A2 = sqrt((theta0 - phi0)**2 / 4 + (theta_dot0 - phi_dot0)**2 / (4 * w2**2));
  if (A1 != 0){
    o1 = asin((theta0 + phi0) / (2 * A1));
  } else { o1 = 0; }
  if (A2 != 0){
    o2 = asin((theta0 - phi0) / (2 * A2));
  } else { o2 = 0; }

  isRunning = true;
  t = 0;
}

function stopSimulation() {
  isRunning = false;
  past_theta.clear();
  past_phi.clear();
}

// ==================== Utility functions ====================
function sign(x) {
  return x > 0 ? 1 : -1;
}

function mod(x, y) {
  return x - y * floor(x / y);
}

function drawConfigurationSpace(theta, phi, color1 = "red", color2 = "green") {
  stroke("black");
  fill("white");
  rect(width/2 + 20, 10, width/2 - 40, height/2 - 40, 10);
  let x0 = width/2 + 20 + width/4 - 20;
  let y0 = 10 + height/4 - 20;
  let lq = width/4 - 20;
  stroke(color1);
  fill(color1);
  drawArrow(x0 - lq, y0, x0 + lq, y0);
  stroke(color2);
  fill(color2);
  drawArrow(x0, y0 + lq, x0, y0 - lq);

  for (let i = 0; i < circ_buffer_size; i++){
    fill(0, 0, 0, 100 - i*100/circ_buffer_size);
    stroke(0, 0, 0, 100 - i*100/circ_buffer_size);
    circle(x0 + past_theta.get(i) * lq, y0 - past_phi.get(i) * lq, 1);
  }
  
  stroke("black");
  fill("black");

  circle(x0 + theta * lq, y0 - phi * lq, 10);
  
  line(x0-lq, y0-lq, x0 + lq, y0 + lq);
  line(x0-lq, y0+lq, x0 + lq, y0 - lq);

  circle(x0 + (theta - phi)/sqrt(2) * lq, y0 + (theta - phi)/sqrt(2) * lq, 4);
  circle(x0 + (theta + phi)/sqrt(2) * lq, y0 - (theta + phi)/sqrt(2) * lq, 4);
}

function drawPendulums(theta, phi, color1 = "red", color2 = "green") {
  stroke(color1);
  fill(color1);
  line((width - d)/2, height/2, (width - d)/2 + l * sin(theta), height/2 + l * cos(theta));
  circle((width - d)/2 + l * sin(theta), height/2 + l * cos(theta), m*2);
  stroke(color2);
  fill(color2);
  line((width + d)/2, height/2, (width + d)/2 + l * sin(phi), height/2 + l * cos(phi));
  circle((width + d)/2 + l * sin(phi), height/2 + l * cos(phi), m*2);
}

function drawSpring(x1, y1, x2, y2, color = "black") {
  stroke(color);
  fill(color);
  if (k == 0){
    line(x1, y1, x2, y2);
    return;
  }
  let d = dist(x1, y1, x2, y2);
  let line_direction = createVector(x2 - x1, y2 - y1).normalize();
  let orthogonal_direction = createVector(-line_direction.y, line_direction.x);
  let current_point = createVector(x1, y1);
  let n_zigzag = constrain(k, 1, 40);
  let zigzaglenght = (d/2) / n_zigzag;
  let molla_height = 5;

  current_point = turtle(current_point, line_direction.copy().mult(d/4));
  for (let i = 0; i < n_zigzag; i++){
    current_point = turtle(current_point, p5.Vector.add(line_direction.copy().mult(zigzaglenght/3), orthogonal_direction.copy().mult(molla_height)));
    current_point = turtle(current_point, p5.Vector.add(line_direction.copy().mult(zigzaglenght/3), orthogonal_direction.copy().mult(-2*molla_height)));
    current_point = turtle(current_point, p5.Vector.add(line_direction.copy().mult(zigzaglenght/3), orthogonal_direction.copy().mult(molla_height)));
  }
  current_point = turtle(current_point, line_direction.copy().mult(d/4));
}

function turtle(current_point, direction){
  line(current_point.x, current_point.y, current_point.x + direction.x, current_point.y + direction.y);
  current_point.x += direction.x;
  current_point.y += direction.y;
  return current_point;
}

function drawArrow(x1, y1, x2, y2) {
  let angle = atan2(y2 - y1, x2 - x1);
  let d = dist(x1, y1, x2, y2);
  line(x1, y1, x2, y2);
  if (d < 10) {
    return;
  }
  push();
  translate(x2, y2);
  rotate(angle);
  triangle(-10, 5, -10, -5, 0, 0);
  pop();
}