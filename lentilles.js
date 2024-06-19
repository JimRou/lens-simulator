let over = false;  // If mouse over
let move = false;  // If mouse down and over
var focale;//focale de la lentille
var posO;//position de l'objet
var posI;//position de l'image
var gamma;//grandissement
var hObjet;//hauteur de l'objet
var w1, h1;
var ObjetCol;
//-------- GUI
let selecteur; //pour sélectionner la nature de la lentile

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeCap(SQUARE);
  frameRate(15);
  focale=-width/6;
  posO=1.5*focale;
  hObjet=height/10;
  selecteur = createSelect();
  selecteur.position(width/20, height/20);
  selecteur.option('divergente');
  selecteur.option('convergente');
  selecteur.changed(mySelectEvent);
  //couleurs
  colorMode(RGB, 1.0);
  w1=width/2;
  h1=height/2;
  ObjetCol=color(.75);
}


function draw() {
  background(.25);
  traceObjet(ObjetCol);
  calcul();
  traceImage(.78);
  traceRayons(1);
  traceLentille(focale);
  resultats();
  // On teste si la souris est sur l'objet
  if (mouseX > (w1+posO-15) && mouseX < (w1+posO+15) && mouseY < h1 && mouseY >h1-hObjet)
  {
    over = true;
    ObjetCol=color('#FF9D00');
    dessineFleche();
  } else {
    over = false;
    ObjetCol=color(.75);
  }
  if (move) {
    posO = mouseX-w1;
  }
}

function dessineFleche() {
  //strokeWeight(2);
  fill(1, sin(frameCount/2));
  translate(w1+posO, h1+20);
  textAlign(CENTER, BASELINE);
  textSize(int(6+width*0.01));
  text('\u2194', 0, 0);
}

//procédure pour tracer une lentille - focale est la distance focale image
function traceLentille(focale) {
  var hL='.45'*height;
  push();
  translate(w1, h1);
  strokeWeight(3);
  stroke(color('#09C'));
  //tracé de la lentille
  line(0, hL, 0, -hL);
  stroke(color('#FF9D00'));
  fill(color('#FF9D00'));
  beginShape(TRIANGLES);
  if (focale<0) {
    vertex(0, hL-10);
    vertex(5, hL);
    vertex(-5, hL);
    vertex(0, -hL+10);
    vertex(5, -hL);
    vertex(-5, -hL);
  } else {
    vertex(0, hL);
    vertex(5, hL-10);
    vertex(-5, hL-10);
    vertex(0, -hL);
    vertex(5, -hL+10);
    vertex(-5, -hL+10);
  }
  endShape();
  //Tracé de son axe optique
  strokeWeight(1);
  line(-w1, 0, w1, 0);
  //Tracé des foyers
  textAlign(CENTER, BASELINE);
  textSize(int(6+width*0.01));
  fill(1);
  noStroke();
  line(-focale, -2, -focale, 2);
  text("F", -focale, -5);
  line(focale, -2, focale, 2);
  text("F'", focale, -5);
  pop();
}

//Tracé de l'objet
function traceObjet(couleurObjet) {
  textAlign(CENTER, BASELINE);
  stroke(couleurObjet);
  fill(couleurObjet);
  push();
  translate(width/2, height/2);
  textSize(height/8);
  text("\u261D", posO, 0);//la forme de l'objet est un caractère (codé en js)
  pop();
}

// Tracé de l'image
function traceImage(couleurImage) {
  textAlign(CENTER, BASELINE);
  textSize(height/8);
  stroke(couleurImage);
  fill(couleurImage);
  push();
  translate(width/2+posI, height/2);
  scale(pow(gamma, 2), abs(gamma));
  if (gamma<0) {
    rotate(PI);
  }
  text("\u261D", 0, 0);
  pop();
}

//calcul du grandissement et de la position de l'image
function calcul() {
  if (posO+focale!=0 & posO!=0) {
    posI=int(posO*focale/(posO+focale));
    gamma=float(focale)/float(posO+focale);
  }
  if (posO+focale==0) {
    posI=-1000;
    gamma=1000/focale;
  }
  if (posO==0) {
    posI=0;
    gamma=1;
  }
}

// Tracé des rayons
function traceRayons(couleurRayons) {
  push();
  translate(w1, h1);
  if (posO<0) {
    Rayon(posO, -hObjet, w1, -hObjet*w1/posO, couleurRayons);//passant par l'origine
    Rayon(posO, -hObjet, 0, -hObjet, couleurRayons);//parallèle à l'axe optique
    Rayon(0, -hObjet, w1, -hObjet+(w1*hObjet)/focale, couleurRayons);
    Rayon(posO, -hObjet, 0, -hObjet*focale/(posO+focale), couleurRayons);//rayon se prolongeant en F
    Rayon(0, -hObjet*focale/(posO+focale), w1, -hObjet*focale/(posO+focale), couleurRayons);//rayon émergeant parallèlement
    stroke(couleurRayons, 0.25);
    line(focale, 0, w1, -hObjet+(w1*hObjet)/focale);//prolongement passant par  F'
    line(0, -hObjet*focale/(posO+focale), -focale, 0);//prolongement en F
    line(0, -gamma*hObjet, posI, -gamma*hObjet);
  }
  if (posO>0) {
    Rayon(-w1, hObjet*w1/posO, w1, -hObjet*w1/posO, couleurRayons);//passant par l'origine
    Rayon(-w1, -hObjet, 0, -hObjet, couleurRayons);//parallèle à l'axe optique
    Rayon(0, -hObjet, w1, -hObjet*(1-w1/focale), couleurRayons);//issu de F'
    if (posO+focale<0) {//objet avant F
      Rayon(-w1, -hObjet*(-w1+focale)/(posO+focale), 0, -hObjet*focale/(posO+focale), couleurRayons);
      Rayon(0, -hObjet*focale/(posO+focale), w1, -hObjet*focale/(posO+focale), couleurRayons);
      stroke(couleurRayons, 0.25);//ci dessous les prolongements
      line(0, -hObjet, posO, -hObjet);//parallèle à l'axe optique
      line(focale, 0, 0, -hObjet);//issu de F'
      line(0, -hObjet*focale/(posO+focale), posO, -hObjet);
    }
    if (posO+focale>0) {
      Rayon(-w1, -hObjet*(-w1+focale)/(posO+focale), 0, -hObjet*focale/(posO+focale), couleurRayons);//passant par F
      Rayon(0, -hObjet*focale/(posO+focale), w1, -hObjet*focale/(posO+focale), couleurRayons);//emergeant parallèle à l'axe optique
      stroke(couleurRayons, 0.25);//ci dessous les prolongements
      line(0, -hObjet, posO, -hObjet);//parallèle à l'axe optique
      line(posI, -hObjet*focale/(posO+focale), w1, -hObjet*focale/(posO+focale));//parallèle à l'axe optique
      line(posI, -hObjet*focale/(posO+focale), 0, -hObjet);//issu de F'
      line(0, -hObjet*focale/(posO+focale), posO, -hObjet);
    }
  }
  if (posO==0) {
    posI=0;
  }
  pop();
}


function Rayon(x1, y1, x2, y2, c) {
  for (var k=5; k>0; k--) {
    strokeWeight(k);
    stroke(color(red(c), green(c), blue(c), 1/k));
    line(x1, y1, x2, y2)
  }
}

function resultats() {
  var offset=height-10;
  textAlign(LEFT, BASELINE);
  fill(1, 0.5);
  noStroke();
  //rect(0, 0, .25*width, height);
  textSize(int(9+width/200));
  fill(1);
  if (posO<0) {
    text("Objet réel", width/20, offset);
  } else {
    text("Objet virtuel", width/20, offset);
  }
  if (posI<0) {
    text("Image virtuelle", .3*width, offset);
  } else {
    text("Image réelle", .3*width, offset);
  }
  text("\u0194 transversal = "+nfp(gamma, 2, 1), .55*width, offset);
  text("\u0194 latéral = "+nfp(pow(gamma, 2), 2, 1), .8*width, offset);
}


function mySelectEvent() {
  let nom = selecteur.value();
  switch(nom) {
  case 'convergente':
    focale=width/6;
    break;
  case 'divergente':
    focale=-width/6;
    break;
  }
}

function windowResized() {
  // redimensionner dynamiquement notre canvas aux dimensions de la fenêtre de notre navigateur
  resizeCanvas(windowWidth, windowHeight);
  selecteur.position(width/20, height/20);
  w1=width/2;
  h1=height/2;
  focale=-width/6;
  posO=1.5*focale;
  hObjet=height/10;
}

function touchStarted() {
  if (over) {
    move = true;
  }
}
function touchEnded() {
  move = false;
  ObjetCol=color(.75);
}
