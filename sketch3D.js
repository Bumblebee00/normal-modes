//TODO: find formulas for initial conditions, mmake the buttons and sliders, add the trace, and rethinh the interface bc the 3d graph is too small
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

let circ_buffer_size = 700;
let past_theta = new circularBuffer(circ_buffer_size);
let past_phi = new circularBuffer(circ_buffer_size);

let l = 200; // rest length of the springs (cm)
let k = 5; // spring constant (N/m)
let m = 1; // mass of the masses (kg)

let w1; // oscillation frequency on the first normal mode
let w2;
let w3;
let A1 = 40;
let A2 = 50;
let A3 = 10;
let o1 = 1;
let o2 = 2;
let o3 = 3;

let t = 0;
let q1, q2, q3;
let qe = 2*l/3;

let thetaSlider, thetaDotSlider, phiSlider, phiDotSlider;
let kTextBox, gTextBox, lTextBox, m1TextBox, m2TextBox;
let startButton, stopButton;
let isRunning = false;

let graphics3D;

function setup() {
  createCanvas(700, 700);
  graphics3D = createGraphics(350, 350, WEBGL);

  angleMode(RADIANS);

  // Create sliders
  // thetaSlider = createSlider(-PI/6, PI/6, 0, 0.01);
  // thetaSlider.position(10, 10);
  // thetaDotSlider = createSlider(-1, 1, 0, 0.1);
  // thetaDotSlider.position(10, 30);
  // phiSlider = createSlider(-PI/6, PI/6, 0, 0.01);
  // phiSlider.position(10, 50);
  // phiDotSlider = createSlider(-1, 1, 0, 0.1);
  // phiDotSlider.position(10, 70);

  // // Create text boxes
  // kTextBox = createInput(k.toString());
  // kTextBox.position(10, 90);
  // kTextBox.size(30);

  // lTextBox = createInput(l.toString());
  // lTextBox.position(10, 130);
  // lTextBox.size(30);

  // mTextBox = createInput(m.toString());
  // mTextBox.position(10, 170);
  // mTextBox.size(30);

  // // Create buttons
  // startButton = createButton('Start');
  // startButton.position(200, 105);  
  // startButton.mousePressed(startSimulation);
  // stopButton = createButton('Stop');
  // stopButton.position(200, 125);
  // stopButton.mousePressed(stopSimulation);

  isRunning = true
}

function draw() {
  background(220);
  // Draw configuration space
  // drawConfigurationSpace(theta, phi);
  w1 = sqrt( ( 16*(l/100)**2 - 12*l/100)/(3*m) );
  w2 = sqrt( ( 16*(l/100)**2 - 10*l/100)/m     );
  w3 = sqrt( (112*(l/100)**2 - 30*l/100)/(3*m) );

  let v1 = createVector(-1,1,1);
  let v2 = createVector(0,-1,1);
  let v3 = createVector(2,1,1);

  let q = p5.Vector.add(v1.copy().mult(A1 * sin(w1 * t + o1)) , v2.copy().mult(A2 * sin(w2 * t + o2)));
  q.add(v3.copy().mult(A3 * sin(w3 * t + o3)));

  q1 = qe + q.x;
  q2 = qe + q.y;
  q3 = qe + q.z;
  

  drawSprings(q1, q2, q3);
  drawBeads(q1, q2, q3);

//   // add text
//   fill(0);
//   text("Theta: " + round(theta0 *180/PI * 100) / 100 + " deg", thetaSlider.x + thetaSlider.width + 10, thetaSlider.y + 15);
//   text("Theta Dot: " + round(theta_dot0 *180/PI * 100) / 100 + " deg/s", thetaDotSlider.x + thetaDotSlider.width + 10, thetaDotSlider.y + 15);
//   text("Phi: " + round(phi0 *180/PI * 100) / 100 + " deg", phiSlider.x + phiSlider.width + 10, phiSlider.y + 15);
//   text("Phi Dot: " + round(phi_dot0 *180/PI * 100) / 100 + " deg/s", phiDotSlider.x + phiDotSlider.width + 10, phiDotSlider.y + 15);  
//   text("Spring Constant (N/m)", kTextBox.x + 40, kTextBox.y+15);
//   text("Gravity (m/s^2)", gTextBox.x + 40, gTextBox.y+15);
//   text("Length of pendulum (cm)", lTextBox.x + 40, lTextBox.y+15);
//   text("Mass of pendulum 1 (kg)", m1TextBox.x + 40, m1TextBox.y+15);
//   text("Mass of pendulum 2 (kg)", m1TextBox.x + 40, m1TextBox.y+35);


  if (isRunning) {
    // past_theta.push(theta);
    // past_phi.push(phi);
    // // Calculate pendulum positions
    // theta = (A1 * sin(w1 * t + o1) + A2 * m2 * sin(w2 * t + o2));
    // phi = (A1 * sin(w1 * t + o1) - A2 * m1 * sin(w2 * t + o2));
    t += 0.01;
  } else{
    // Update parameters
    // k = parseFloat(kTextBox.value());
    // g = parseFloat(gTextBox.value());
    // l = parseFloat(lTextBox.value());
    // m1 = parseFloat(m1TextBox.value());
    // m2 = parseFloat(m2TextBox.value());
    // // Update starting conditions based on sliders
    // theta0 = thetaSlider.value();
    // theta_dot0 = thetaDotSlider.value();
    // phi0 = phiSlider.value();
    // phi_dot0 = phiDotSlider.value();

    // theta = theta0;
    // phi = phi0;

    // // show thetha_dot0 and phi_dot0 with arrows
    // stroke("blue");
    // drawArrow((width-d)/2 + l * sin(theta), height/2 + l * cos(theta), (width-d)/2 + l * sin(theta) + theta_dot0 *100* cos(theta), height/2 + l * cos(theta) - theta_dot0 *100* sin(theta));
    // drawArrow((width+d)/2 + l * sin(phi), height/2 + l * cos(phi), (width+d)/2 + l * sin(phi) + phi_dot0 *100* cos(phi), height/2 + l * cos(phi) - phi_dot0 *100* sin(phi));
  }
  graphics3D.clear();
  graphics3D.push();
  graphics3D.rotateX(sin(frameCount * 0.01)*0.1);
  graphics3D.rotateY(frameCount * 0.01);

  // Set the stroke for the lines
  graphics3D.stroke(0);
  graphics3D.strokeWeight(2);
  
  // Draw a white cube surrounding the axes
  graphics3D.stroke(255);
  graphics3D.noFill();
  graphics3D.box(200);  // White cube with a side length of 200

  // Draw three perpendicular lines representing the X, Y, and Z axes
  graphics3D.stroke(255, 0, 0);
  graphics3D.line(-100, 0, 0, 100, 0, 0);  // X-axis (red)
  graphics3D.translate(100,0,0)
  graphics3D.rotate(-PI/2)
  graphics3D.cone(2, 5)
  graphics3D.rotate(PI/2)
  graphics3D.translate(-100,0,0)

  graphics3D.stroke("green");
  graphics3D.line(0, -100, 0, 0, 100, 0);  // Y-axis (green)
  graphics3D.translate(0,100,0)
  graphics3D.cone(2, 5)
  graphics3D.translate(0,-100,0)

  graphics3D.stroke(0, 0, 255);
  graphics3D.line(0, 0, -100, 0, 0, 100);  // Z-axis (blue)
  graphics3D.translate(0,0,100)
  graphics3D.rotateX(PI/2)
  graphics3D.cone(2, 5)
  graphics3D.rotateX(-PI/2)
  graphics3D.translate(0,0,-100)
  

  let tmp = 150;
  graphics3D.stroke(0,0,0,80)
  graphics3D.line(tmp*v1.x, tmp*v1.y, tmp*v1.z, -tmp*v1.x, -tmp*v1.y, -tmp*v1.z)
  graphics3D.line(tmp*v2.x, tmp*v2.y, tmp*v2.z, -tmp*v2.x, -tmp*v2.y, -tmp*v2.z)
  graphics3D.line(tmp*v3.x, tmp*v3.y, tmp*v3.z, -tmp*v3.x, -tmp*v3.y, -tmp*v3.z)


  graphics3D.stroke(0)
  graphics3D.strokeWeight(7)
  graphics3D.point(q.x,q.y,q.z)
  
  graphics3D.stroke(80)
  graphics3D.strokeWeight(5)
  projOnV1 = v1.copy().mult(p5.Vector.dot(v1, q)/(v1.mag()**2))
  graphics3D.point(projOnV1.x, projOnV1.y, projOnV1.z)
  projOnV2 = v2.copy().mult(p5.Vector.dot(v2, q)/(v2.mag()**2))
  graphics3D.point(projOnV2.x, projOnV2.y, projOnV2.z)
  projOnV3 = v3.copy().mult(p5.Vector.dot(v3, q)/(v3.mag()**2))
  graphics3D.point(projOnV3.x, projOnV3.y, projOnV3.z)
  
  graphics3D.stroke(0,0,0,80)
  graphics3D.strokeWeight(1)
  graphics3D.line(projOnV1.x, projOnV1.y, projOnV1.z, q.x,q.y,q.z)
  graphics3D.line(projOnV2.x, projOnV2.y, projOnV2.z, q.x,q.y,q.z)
  graphics3D.line(projOnV3.x, projOnV3.y, projOnV3.z, q.x,q.y,q.z)


  graphics3D.pop();
  
  // Render the 3D graphics buffer on top of the main canvas
  image(graphics3D, 350, 0);  // Position the 3D graphics at
}

function startSimulation() {
  // calculate equation parameters
  w1 = sqrt(100 * g / l);
  w2 = sqrt((100 * g / l) + (2 * k * (m1 + m2) / (m1 * m2)));
  let m3 = (m2 - m1) / (m1 + m2);

  A1 = sqrt((theta0 + phi0 - m3*(theta0 - phi0))**2 / 4 + (theta_dot0 + phi_dot0 - m3*(theta_dot0 - phi_dot0))**2 / (4 * w1**2));
  A2 = sqrt(((theta0 - phi0)/(m2 + m1))**2 + ((theta_dot0 - phi_dot0)/(w2 * (m1 + m2)))**2 );
  if (A1 != 0){
    o1 = asin((theta0 + phi0 - m3*(theta0 - phi0))/(2*A1));
  } else { o1 = 0; }
  if (A2 != 0){
    o2 = asin((theta0 - phi0) / ((m2 + m1) * A2));
  } else { o2 = 0; }

  print("w1: " + w1);
  print("w2: " + w2);
  print("A1: " + A1);
  print("A2: " + A2);
  print("o1: " + o1);
  print("o2: " + o2);

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

}

function drawBeads(q1, q2, q3){
  let tmp = 400;
  stroke(0,0,0,50);
  line(350, 350, 350, 0);
  line(350, 350, 350 - tmp * sqrt(3) / 2, 350 + tmp /2);
  line(350, 350, 350 + tmp * sqrt(3) / 2, 350 + tmp /2);


  r = 7;
  stroke("red");
  fill("red");
  circle(350, 350 - q1, r);
  stroke("green");
  fill("green");
  circle(350 - q2 * sqrt(3) / 2, 350 + q2 / 2, r);
  stroke(0, 0, 255);
  fill(0, 0, 255);
  circle(350 + q3 * sqrt(3) / 2, 350 + q3 / 2, r);

}

function drawSprings(q1, q2, q3){
    drawSpring(350, 350 - q1, 350 - q2 * sqrt(3) / 2, 350 + q2 / 2);
    drawSpring(350, 350 - q1, 350 + q3 * sqrt(3) / 2, 350 + q3 / 2);
    drawSpring(350 + q3 * sqrt(3) / 2, 350 + q3 / 2, 350 - q2 * sqrt(3) / 2, 350 + q2 / 2);
}

function drawSpring(x1, y1, x2, y2, color = "black") {
  stroke(color);
  fill(color);
  if (k == 0){
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