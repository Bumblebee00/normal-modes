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
let startButton, stopButton;
let isRunning = false;

function setup() {
  createCanvas(400, 400);

  w1 = sqrt(100 * g / l);
  w2 = sqrt((100 * g / l) + (2 * k / m));

  // Create sliders
  thetaSlider = createSlider(-PI, PI, theta0, 0.01);
  thetaSlider.position(20, height - 110);
  thetaDotSlider = createSlider(-10, 10, theta_dot0, 0.1);
  thetaDotSlider.position(20, height - 80);
  phiSlider = createSlider(-PI, PI, phi0, 0.01);
  phiSlider.position(20, height - 50);
  phiDotSlider = createSlider(-10, 10, phi_dot0, 0.1);
  phiDotSlider.position(20, height - 20);

  // Create buttons
  startButton = createButton('Start');
  startButton.position(300, 300);
  startButton.mousePressed(startSimulation);
  stopButton = createButton('Stop');
  stopButton.position(300, 350);
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
    // Update starting conditions based on sliders
    theta0 = thetaSlider.value();
    theta_dot0 = thetaDotSlider.value();
    phi0 = phiSlider.value();
    phi_dot0 = phiDotSlider.value();

    theta = theta0;
    phi = phi0;

    // show thetha_dot0 and phi_dot0 with arrows
    stroke("blue");
    drawArrow(100 + l * sin(theta), l * cos(theta), 100 + l * sin(theta) - theta_dot0 *100* cos(theta), l * cos(theta) + theta_dot0 *100* sin(theta));
    drawArrow(300 + l * sin(phi), l * cos(phi), 300 + l * sin(phi) + phi_dot0 *100* cos(phi), l * cos(phi) + phi_dot0 *100* sin(phi));
  }

  // Draw pendulums
  stroke("red");
  line(100, 0, 100 + l * sin(theta), l * cos(theta));
  line(300, 0, 300 + l * sin(phi), l * cos(phi));
  
  // Draw springs
  stroke(0);
  drawSpring(100 + l * sin(theta), l * cos(theta), 300 + l * sin(phi), l * cos(phi));
  
  // Show numerical values on sliders
  fill(0);
  text("Theta: " + round(theta0 *180/PI * 100) / 100 + " deg", thetaSlider.x + thetaSlider.width + 10, thetaSlider.y + 15);
  text("Theta Dot: " + round(theta_dot0 *180/PI * 100) / 100 + " deg/s", thetaDotSlider.x + thetaDotSlider.width + 10, thetaDotSlider.y + 15);
  text("Phi: " + round(phi0 *180/PI * 100) / 100 + " deg", phiSlider.x + phiSlider.width + 10, phiSlider.y + 15);
  text("Phi Dot: " + round(phi_dot0 *180/PI * 100) / 100 + " deg/s", phiDotSlider.x + phiDotSlider.width + 10, phiDotSlider.y + 15);  
}

function drawSpring(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  let dx = (x2 - x1) / 10;
  let dy = (y2 - y1) / 10;
  for (let i = 0; i < 11; i++) {
    let x = x1 + i * dx;
    let y = y1 + i * dy;
    ellipse(x, y, 5, 5);
  }
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