let song;//set audio variable
let fft;//declare fft for spectrum analysis
let fftBins = 256;//set the num of bins
let amplitude;//set variable amplitude, use to detect the volume level of audio
let time = 0;  //time variable, to track time
let colorHue = 0;//set Hue variables in HSB color mode
let frameSave;//save current frame image

function preload() {
  song = loadSound('Audio/sample-visualisation.mp3');//load audio file ussing preload
}

function setup() {
  createCanvas(1000, 900);//create canvas
  amplitude = new p5.Amplitude();//initialize the amplitude object
  fft = new p5.FFT(0.9, fftBins);//initialize FFT object
  colorMode(HSB, 255);//set color mode to HSB
  angleMode(DEGREES);//set angle mode to degrees
}

function draw() {
  background(colorHue, 255, 255, 20);//set background color

  let spectrum = fft.analyze(); //get spectrum data
  let level = amplitude.getLevel();//get the current audio volume level

  translateMovement(level);//move the starting position of the drawing based on the amplitude of the audio
  
  drawSpiral(spectrum, level);//draw spiral graphics based on spectrum data
  
  colorHue = map(level, 0, 1, 0, 255);//maps tonal values ​​based on the volume level of the audio
  
  frameSave = get();//get the image of the current frame
  time += 1;//increase time value
}

//move the starting position of the drawing based on the amplitude of the audio
function translateMovement(level) {
  let xOff = map(level, 0, 1, -5, 5);//maps the offset of the x-axis based on the volume level of the audio
  //if the value of time less than 200
  if(time < 200) {
    translate(time * width / 400 + xOff, height / 2);//move the x-coordinate according to the time and width, set y-coordinate to half of the canvas
  } else {
    image(frameSave, -1, 0, width, height);//otherwise,display a previously saved frame at the specified position
    translate(width / 2 + xOff, height / 2);
  }
}

//draw spiral graphics based on spectrum data
function drawSpiral(spectrum, level) {
  let angleOff = frameCount * 0.5;//calculate angle offset
  stroke(colorHue, 255, 255);//set the color of stroke
  noFill();//fill with no color
  beginShape(); //start to draw the shape
  for (let i = 0; i < fftBins; i++) {  //loop through each spectrum segment
    let angle = map(i, 0, fftBins, 0, 360) + angleOff;//calculate the angle of the current bin
    let r = map(spectrum[i], 0, 255, 20, 500) + (i * level * 2);//map radius based on spectrum data and volume level
    let x = r * cos(angle); //calculate x position
    let y = r * sin(angle);//calculate y position
    vertex(x, y);//create vertex
  }
  endShape();//stop drawing shape
}

//click to play or pause the audio
function mousePressed() {
  if (song.isPlaying()) song.stop();//if the audio is playing then pause it
  else song.play(); //otherwise, play it
}

//press space to change color
function keyPressed() {
  if (key === ' ') {
    colorHue = random(255); //get a random value of color
  }
}
