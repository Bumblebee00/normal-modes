let l = 200; // in cm
let g = 9.8; // gravity
let k = 10; // spring constant
let m = 10; // mass of both pendulums

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
let kTextBox, gTextBox, mTextBox, lTextBox;
let startButton, stopButton;
let isRunning = false;

function setup() {
  createCanvas(800, 800);

  // Create sliders
  thetaSlider = createSlider(-PI, PI, theta0, 0.01);
  thetaSlider.position(20, height - 110);
  thetaDotSlider = createSlider(-10, 10, theta_dot0, 0.1);
  thetaDotSlider.position(20, height - 80);
  phiSlider = createSlider(-PI, PI, phi0, 0.01);
  phiSlider.position(20, height - 50);
  phiDotSlider = createSlider(-10, 10, phi_dot0, 0.1);
  phiDotSlider.position(20, height - 20);

  // Create text boxes
  kTextBox = createInput(k.toString());
  kTextBox.position(20, 20);
  gTextBox = createInput(g.toString());
  gTextBox.position(140, 20);
  mTextBox = createInput(m.toString());
  mTextBox.position(260, 20);
  lTextBox = createInput(l.toString());
  lTextBox.position(380, 20);

  // Create buttons
  startButton = createButton('Start');
  startButton.position(500, height - 40);
  startButton.mousePressed(startSimulation);
  stopButton = createButton('Stop');
  stopButton.position(600, height - 40);
  stopButton.mousePressed(stopSimulation);
}

function draw() {
  background(220);
  
  if (isRunning) {
    // Calculate pendulum positions
    theta = (A1 * sin(w1 * t + o1) + A2 * sin(w2 * t + o1));
    phi = (A1 * sin(w1 * t + o2) - A2 * sin(w2 * t + o2));
    t += 0.01;
  } else{
    // Update parameters
    k = parseFloat(kTextBox.value());
    g = parseFloat(gTextBox.value());
    m = parseFloat(mTextBox.value());
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
    drawArrow(300 + l * sin(theta), 400 + l * cos(theta), 300 + l * sin(theta) + theta_dot0 *100* cos(theta), 400 + l * cos(theta) - theta_dot0 *100* sin(theta));
    drawArrow(500 + l * sin(phi), 400 + l * cos(phi), 500 + l * sin(phi) + phi_dot0 *100* cos(phi), 400 + l * cos(phi) - phi_dot0 *100* sin(phi));
  }

  // Draw pendulums
  stroke("red");
  fill("red");
  line(300, 400, 300 + l * sin(theta), 400 + l * cos(theta));
  circle(300 + l * sin(theta), 400 + l * cos(theta), m*2);
  line(500, 400, 500 + l * sin(phi), 400 + l * cos(phi));
  circle(500 + l * sin(phi), 400 + l * cos(phi), m*2);
  // Draw spring
  stroke(0);
  fill(0);
  drawSpring(300 + l * sin(theta), 400 + l * cos(theta), 500 + l * sin(phi), 400 + l * cos(phi));
  
  // Show numerical values on sliders
  fill(0);
  text("Theta: " + round(theta0 *180/PI * 100) / 100 + " deg", thetaSlider.x + thetaSlider.width + 10, thetaSlider.y + 15);
  text("Theta Dot: " + round(theta_dot0 *180/PI * 100) / 100 + " deg/s", thetaDotSlider.x + thetaDotSlider.width + 10, thetaDotSlider.y + 15);
  text("Phi: " + round(phi0 *180/PI * 100) / 100 + " deg", phiSlider.x + phiSlider.width + 10, phiSlider.y + 15);
  text("Phi Dot: " + round(phi_dot0 *180/PI * 100) / 100 + " deg/s", phiDotSlider.x + phiDotSlider.width + 10, phiDotSlider.y + 15);  
  // Add legends above text boxes
  text("Spring Constant N/m", kTextBox.x + 10, kTextBox.y - 10);
  text("Gravity m/s^2", gTextBox.x + 10, gTextBox.y - 10);
  text("Mass kg", mTextBox.x + 10, mTextBox.y - 10);
  text("Length cm", lTextBox.x + 10, lTextBox.y - 10);
}

function drawSpring(x1, y1, x2, y2) {
  d = dist(x1, y1, x2, y2);
  let line_direction = createVector(x2 - x1, y2 - y1).mult(1/d);
  let orthogonal_direction = createVector(-line_direction.y, line_direction.x);
  let current_point = createVector(x1, y1);

  current_point = turtle(current_point, line_direction.copy().mult(d/4));
  let n_zigzag = constrain(k, 2, 50);
  let zigzaglenght = (d/2) / n_zigzag;
  let molla_height = 5;
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


// draw arrow between two points, with a trinagle at the end
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

function startSimulation() {
  // calculate equation parameters
  w1 = sqrt(100 * g / l);
  w2 = sqrt((100 * g / l) + (2 * k / m));

  o1 = atan(w1 *( phi0 + theta0) / (phi_dot0 + theta_dot0));
  o2 = atan(w1 *( phi0 - theta0) / (phi_dot0 - theta_dot0));
  A1 = sqrt(pow((phi_dot0 + theta_dot0)/w1, 2) + pow(phi0 + theta0, 2))/2; // sqrt(2) is for normalization (to make the amplitude 1)
  A2 = -sqrt(pow((phi_dot0 - theta_dot0)/w2, 2) + pow(phi0 - theta0, 2))/2;
  isRunning = true;
  t = 0;
}

function stopSimulation() {
  isRunning = false;
}

function sign(x) {
  return x > 0 ? 1 : -1;
}