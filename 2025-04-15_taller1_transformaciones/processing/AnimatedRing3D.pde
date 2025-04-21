PVector[] vertices;  // Vertices del triangulo
int duracion = 240;  // Duracion del ciclo (4 segundos a 60 FPS)

void setup() {
  size(600, 600, P3D);
  frameRate(60);

  // Definir los 3 vertices del triangulo de traslacion
  vertices = new PVector[3];
  float r = 150;
  for (int i = 0; i < 3; i++) {
    float ang = TWO_PI * i / 3 - PI / 2;
    vertices[i] = new PVector(r * cos(ang), r * sin(ang), 0);
  }
}

void draw() {
  background(0); 
  lights();

  float t = frameCount % duracion;
  float prog = t / duracion;

  //Interpolacion a lo largo del triangulo (ruta ciclica)
  int i = floor(prog * 3);
  int j = (i + 1) % 3;
  float localT = (prog * 3) % 1;
  PVector pos = PVector.lerp(vertices[i], vertices[j], localT);

  pushMatrix();

  //Mover al centro de la pantalla + posicion interpolada
  translate(width / 2 + pos.x, height / 2 + pos.y, pos.z);

  //Rotacion sobre eje Y
  rotateY(frameCount * 0.01f); 

  //Escalado ciclico
  float escala = 1 + 0.5f * sin(TWO_PI * prog); 
  scale(escala);
  
  drawRing(50, 15, color(200, 100, 255));

  popMatrix();

  //Trazar el triangulo
  drawTrianglePath();
}

//Funcion para dibujar un anillo
void drawRing(float R, float r, int col) {
  int sides = 40;
  int rings = 40;
  fill(col);
  noStroke();

  for (int i = 0; i < rings; i++) {
    float theta = TWO_PI * i / rings;
    float nextTheta = TWO_PI * (i + 1) / rings;

    beginShape(QUAD_STRIP);
    for (int j = 0; j <= sides; j++) {
      float phi = TWO_PI * j / sides;
      for (int k = 0; k < 2; k++) {
        float angle = (k == 0) ? theta : nextTheta;
        float x = (R + r * cos(phi)) * cos(angle);
        float y = (R + r * cos(phi)) * sin(angle);
        float z = r * sin(phi);
        vertex(x, y, z);
      }
    }
    endShape();
  }
}

// Dibujar el triangulo de trayectoria
void drawTrianglePath() {
  pushStyle();
  stroke(255, 255, 255);
  strokeWeight(1.5f);
  noFill();

  pushMatrix();
  translate(width/2, height/2, 0);

  beginShape();
  for (int i = 0; i < 3; i++) {
    vertex(vertices[i].x, vertices[i].y, vertices[i].z);
  }
  vertex(vertices[0].x, vertices[0].y, vertices[0].z);  
  endShape();

  fill(255, 255, 255);
  noStroke();
  for (int i = 0; i < 3; i++) {
    pushMatrix();
    translate(vertices[i].x, vertices[i].y, vertices[i].z);
    sphere(4); 
    popMatrix();
  }

  popMatrix();
  popStyle();
} 
