let pendulum;
let silhouette;

function setup() {
  createCanvas(1280, 800);
  pendulum = new Pendulum(width / 2, 0, 600);
  silhouette = loadImage("silhouette2.png", img => img.resize(1500, 0)); // Cargar la imagen y redimensionarla
  
  // Establecer velocidad angular constante y eliminar la amortiguación
  pendulum.aVelocity = 0.1; // Velocidad angular constante
  pendulum.damping = 1.0;   // Eliminar la amortiguación
}

function draw() {
  background(0, 10, 10);
  
  pendulum.update();
  pendulum.display();
  
  strokeWeight(10);
  line(width / 2, 0, mouseX, mouseY);
  
  // Dibujar la silueta en la base del canvas
  image(silhouette, width / 2 - silhouette.width / 2, height - silhouette.height);
}

function mousePressed() {
  pendulum.clicked(mouseX, mouseY);
}

function mouseReleased() {
  pendulum.stopDragging();
}

class Pendulum {
  constructor(x, y, length) {
    this.origin = createVector(x, y);
    this.position = createVector();
    this.r = length;
    this.angle = PI / 2;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.damping = 0.995; // Mantener una pequeña amortiguación para evitar desbordamientos
    this.ballr = 180;
    this.dragging = false;
  }

  update() {
    if (!this.dragging) {
      const gravity = 0.2;
      this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);
      this.aVelocity += this.aAcceleration;
      this.aVelocity *= this.damping;
      
      // Restringir el ángulo a un rango de -π/2 a π/2 (90 grados)
      this.angle = constrain(this.angle, -PI/2, PI/2);
      
      this.angle += this.aVelocity;
    }
  }

  display() {
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0);
    this.position.add(this.origin);
    
    ellipseMode(CENTER);
    fill(0);
    noStroke();
    const lightIntensity = map(this.position.y, height, 0, 0, 255);
    this.drawLightCone(lightIntensity);
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
  }

  drawLightCone(intensity) {
    const coneLength = height - this.position.y;
    const coneWidth = 100;
    const p1 = createVector(width / 2 - coneWidth / 2, 0);
    const p2 = createVector(width / 2 + coneWidth / 2, 0);
    const p3 = createVector(width / 2, coneLength);
    
    fill(255, 0, 0, intensity);
    noStroke();
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }

  clicked(mx, my) {
    const d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.ballr) {
      this.dragging = true;
    }
  }

  stopDragging() {
    if (this.dragging) {
      this.aVelocity = 0;
      this.dragging = false;
    }
  }
}
