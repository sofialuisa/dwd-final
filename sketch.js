// Sofía Luisa Suazo Monsalve | May, 2019
// Gets a row of pixels from the webcam image
// The colors of those pixels is being read and mapped to tones
// Final for DWD, ITP

// script being used inline in index.html

// global variables
let capture;
let smallCap;
let pixelSize = 30;
let w;
let h;
let x = 0;
let y = 0;

let pixelData;
let brightPixelData = 0;
let RedPixelData = 0;
let GreenPixelData = 0;
let BluePixelData = 0;

let mapBrightToNote;
let mapRedToNote;
let mapGreenToNote;
let mapBlueToNote;

let imageWiDim = 300;
let imageHeDim = 200;
let imageCenter = 300;
let heightBorder = 100;
let canvasDim = 1200;

let playWasPressed = false;
let pauseWasPressed = false;
let filterValue;
let redChecked;
let greenChecked;
let blueChecked;

//declare time for tone playing
Tone.Transport.bpm.value = 20;
Tone.Transport.start();

//declare a polysynth composed of 40 Voices of Synth
let mySynthBright = new Tone.PolySynth(40, Tone.Synth, {
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 1,
    "decay": 0.9,
    "sustain": 0.6,
    "release": .5
  }
}).toMaster();

//declare a polysynth composed of 40 Voices of Synth
let mySynthRed = new Tone.PolySynth(40, Tone.Synth, {
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 1,
    "decay": 0.9,
    "sustain": 0.6,
    "release": .5
  }
}).toMaster();

//declare a polysynth composed of 40 Voices of Synth
let mySynthGreen = new Tone.PolySynth(40, Tone.Synth, {
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 1,
    "decay": 0.9,
    "sustain": 0.6,
    "release": .5
  }
}).toMaster();

//declare a polysynth composed of 40 Voices of Synth
let mySynthBlue = new Tone.PolySynth(40, Tone.Synth, {
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 1,
    "decay": 0.9,
    "sustain": 0.6,
    "release": .5
  }
}).toMaster();

// dictionary of notes for mayor scale (3 octaves)
var dictBright = {
  0 : "C3",
  1 : "D3",
  2 : "E3",
  3 : "F3",
  4 : "G3",
  5 : "A3",
  6 : "B3",
  7 : "C4",
  8 : "D4",
  9 : "E4",
  10: "F4",
  11: "G4",
  12: "A4",
  13: "B4",
  14: "C5",
  15: "D5",
  16: "E5",
  17: "F5",
  18: "G5",
  20: "A5",
  21: "B5",
  21: "C6"
}

var dictRed = { //La Eolio
  0 : "A3",
  1 : "B3",
  2 : "C4",
  3 : "D4",
  4 : "E4",
  5 : "F4",
  6 : "G4",
  7 : "A4",
  8 : "B4",
  9 : "C5",
  10: "D5",
  11: "E5",
  12: "F5",
  13: "G5",
  14: "A5",
  15: "B5",
  16: "C6",
  17: "D6",
  18: "E6",
  20: "F6",
  21: "G6",
  21: "A6"
}

var dictGreen = { //Mi frigio
  0 : "E3",
  1 : "F3",
  2 : "G3",
  3 : "A3",
  4 : "B3",
  5 : "C4",
  6 : "D4",
  7 : "E4",
  8 : "F4",
  9 : "G4",
  10: "A4",
  11: "B4",
  12: "C5",
  13: "D5",
  14: "E5",
  15: "F5",
  16: "G5",
  17: "A5",
  18: "B5",
  20: "C6",
  21: "D6",
  21: "E6"
}

var dictBlue = { //Sol mixolidio
  0 : "G3",
  1 : "A3",
  2 : "B3",
  3 : "C4",
  4 : "D4",
  5 : "E4",
  6 : "F4",
  7 : "G4",
  8 : "A4",
  9 : "B4",
  10: "C5",
  11: "D5",
  12: "E5",
  13: "F5",
  14: "G5",
  15: "A5",
  16: "B5",
  17: "C6",
  18: "D6",
  20: "E6",
  21: "F6",
  21: "G6"
}

function setup() {

  //Create canvas, get capture from webcam
  createCanvas(canvasDim, canvasDim);
  //createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);

  capture.hide();
  //Size for web cam capture aand create a compress version of it
  capture.size(imageWiDim, imageHeDim);
  pixelDensity(1);
  smallCap = createCapture(VIDEO);
  smallCap.size(imageWiDim/pixelSize, imageHeDim/pixelSize);
  //capture.hide();

  mySynthRed.set("volume", -400);
  mySynthGreen.set("volume", -400);
  mySynthBlue.set("volume", -400);

  let buttonPlay= createButton('Play');
  buttonPlay.position(30, canvasDim/3-15);
  buttonPlay.mousePressed(startPlaying);

  let buttonPause= createButton('Pause');
  buttonPause.position(75, canvasDim/3-15);
  buttonPause.mousePressed(pausePlaying);

  checkboxRed = createCheckbox('Listen to Red', true);
  checkboxRed.position(30, canvasDim/3-80);
  checkboxRed.changed(RedCheckEvent);

  checkboxGreen = createCheckbox('Listen to Green', true);
  checkboxGreen.position(30, canvasDim/3-60);
  checkboxGreen.changed(GreenCheckEvent);

  checkboxGreen = createCheckbox('Listen to Blue', true);
  checkboxGreen.position(30, canvasDim/3-40);
  checkboxGreen.changed(BlueCheckEvent);

  // selFilter = createSelect('Select Filter');
  // selFilter.position(10, 10);
  // selFilter.option('Invert');
  // selFilter.option('Erode');
  // selFilter.option('Dilate');
  //selFilter.changed(changeFilter);
}

// function changeFilter() {
//   filterValue = selFilter.value();
//   console.log("The filter is " + filterValue);
// }

function RedCheckEvent() {
  if (this.checked()) {
    console.log('Checking Red!');
    redChecked = (255);
    mySynthRed.set("volume", 0);
  } else {
    console.log('Unchecking Red!');
    mySynthRed.set("volume", -400);
    redChecked = (0);
  }
}

function GreenCheckEvent() {
  if (this.checked()) {
    console.log('Checking Green!');
    mySynthGreen.set("volume", 0);
    greenChecked = (255);
  } else {
    console.log('Unchecking Green!');
    mySynthGreen.set("volume", -400);
    greenChecked = (0);
  }
}

function BlueCheckEvent() {
  if (this.checked()) {
    console.log('Checking Blue!');
    mySynthBlue.set("volume", 0);
    blueChecked = (255);
  } else {
    console.log('Unchecking Blue!');
    mySynthBlue.set("volume", -400);
    blueChecked = (0);
  }
}

function startPlaying(){

  //Turn up synths
  mySynthRed.set("volume", 0);
  mySynthGreen.set("volume", 0);
  mySynthBlue.set("volume", 0);
  //mySynthBright.set("volume", 0);
  playWasPressed = true;

}

function pausePlaying (){

  //Turn up synths
  mySynthRed.set("volume", -400);
  mySynthGreen.set("volume", -400);
  mySynthBlue.set("volume", -400);
  //mySynthBright.set("volume", 0);
  pauseWasPressed = true;
  playWasPressed = false;

}

function draw() {

  frameRate(5);
  //background(255);
  background(redChecked, greenChecked, blueChecked);

  fill(0);
  textFont('Courier');
  textSize(30);
  text("🔊 🌈 P i x e l H a r m o n i e s 🌈 🔊 ", canvasDim/2-210, 70);

  capture.hide();

  //draw original capture from webcam
  image(capture, imageCenter, heightBorder, imageWiDim, imageHeDim);
  //draw compress version of capture from webcam
  image(smallCap, imageCenter+imageWiDim, heightBorder, imageWiDim, imageHeDim);

  //load pixels from smaller capture image
  //and make a copy the pixels of the middle column of the capture image
  //repeat that pixel to fill the size of the original capture image
  smallCap.loadPixels();
  w = smallCap.width;
  h = smallCap.height;
  //line that goes in the center to point out the section of pixels beign copied
  stroke(0);
  strokeWeight(0.5);
  fill(255,180);

  //rect space to show where i'm getting data from.
  rect(imageCenter, heightBorder*2, imageWiDim*2, ((imageHeDim/2)+6)-6);
  rect(imageCenter, heightBorder, imageWiDim*2, (imageHeDim/2)-6);

  //copy(src,sx,sy,sw,sh, dx, dy, dw, dh)
  //copy the middle column
  //copy(smallCap, w/2, 0, 1, h, 0, 0, imageWiDim, imageWiDim);
  //copy the middle row
  copy(smallCap, 0, h/2, w, 1, 0, imageHeDim+(heightBorder*2), canvasDim, imageHeDim);

  smallCap.updatePixels();

  //Draw a horizontal line that goes down the Y axis over and over
  // if(y<=238){
  // //line (x1, y1, x2, y2)
  // line(x, y, imageWiDim, y);
  // y++;
  // }else{
  // y =0;
  // }

//***************FIX ALL OF THIS******************
  //draw line
  //Draw a vertical line that goes through the X axis over and over
  //Only if Play button was hit.
  if (playWasPressed == true){
    stroke(0);
    strokeWeight(1);
  if(x<=canvasDim){
    line(x, imageHeDim+(heightBorder*2), x, 650);
    x++;
  //draw a square with the color of each position of the line
  fill(pixelData);
  rect(x,canvasDim-580, 90, 30);
  fill(RedPixelData, 0,0, 125);
  rect(x,canvasDim-550, 30, 30);
  fill(0,GreenPixelData,0,125);
  rect(x+30,canvasDim-550, 30, 30);
  fill(0,0,BluePixelData,125);
  rect(x+60,canvasDim-550, 30, 30);
  } else {
  stroke(0);
  strokeWeight(1);
  x = 0;
  line(x, imageHeDim+(heightBorder*2), x, 650);
  fill(pixelData);
  rect(x,canvasDim-580, 90, 30);
  fill(RedPixelData, 0,0, 125);
  rect(x,canvasDim-550, 30, 30);
  fill(0,GreenPixelData,0,125);
  rect(x+30,canvasDim-550, 30, 30);
  fill(0,0,BluePixelData,125);
  rect(x+60,canvasDim-550, 30, 30);
  }
  }

if (redChecked == 0 && greenChecked == 0 && blueChecked == 0){
    playWasPressed = false;
  }

  //get the pixel data of where the scanning line is at
  pixelData = get(x,imageHeDim+(heightBorder*2));
  //console.log(pixelData);

  //Get an average brightness value from the pixel data
  brightPixelData= int((pixelData[0]+ pixelData[1] + pixelData[2])/3);
  //console.log(brightPixelData);
  //fill(brightPixelData);
  //rect(canvasDim-100, imageCenter*3, 50, 50);

  //Get Red, Green and Blue value from the pixel data
  RedPixelData= int(pixelData[0]);
  GreenPixelData= int(pixelData[1]);
  BluePixelData= int(pixelData[2]);

  // constrain values by mapping to note dictionary values
  mapBrightToNote = int(map(brightPixelData, 0, 255, 0, 21));
  mapRedToNote = int(map(brightPixelData, 0, 255, 0, 21));
  mapGreenToNote = int(map(brightPixelData, 0, 255, 0, 21));
  mapBlueToNote = int(map(brightPixelData, 0, 255, 0, 21));

  let noteBright = dictBright[mapBrightToNote];
  let noteRed = dictRed[mapRedToNote];
  let noteGreen = dictGreen[mapGreenToNote];
  let noteBlue = dictBlue[mapBlueToNote];

  playSynth(noteRed, noteGreen, noteBlue);

}

function playSynth(noteInRed, noteInGreen, noteInBlue){
  if (noteInRed != undefined &&
    noteInGreen != undefined &&
    noteInBlue != undefined){
    mySynthRed.triggerAttackRelease(noteInRed, "8n");
    mySynthGreen.triggerAttackRelease(noteInGreen, "8n");
    mySynthBlue.triggerAttackRelease(noteInBlue, "8n");
    //console.log("trigger attack release!!");
    if (playWasPressed == true){
    fill(255, 255);
    textSize(16);
    text(noteInRed, x+5, canvasDim-528);
    text(noteInGreen, x+35, canvasDim-528);
    text(noteInBlue, x+65, canvasDim-528);
  }
  }
}
