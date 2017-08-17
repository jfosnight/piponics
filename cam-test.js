let RaspiCam = require('raspicam');
let moment = require('moment');
let now = require('performance-now');

let awbStr = 'off,auto,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizon';
let awb = awbStr.split(',');
//console.log(awb);

let exStr = 'off,auto,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,fireworks';
let ex = exStr.split(',');
//console.log(ex);

let ifxStr = 'none,negative,solarise,sketch,denoise,emboss,oilpaint,hatch,gpen,pastel,watercolour,film,blur,saturation,colourswap,washedout,posterise,colourpoint,colourbalance,cartoon';
let ifx = ifxStr.split(',');

let iso = [
  100,
  200,
  400,
  800,
  1600,
  3200,
  6400,
];

let camera = new RaspiCam({
  mode: 'photo',
  width: 1920,
  height: 1080,
  output: "image_" + moment().add({second: 1}).format("YYYY-MM-DD_HH.mm.ss") + ".jpg",
  timeout: 1000,
  awb: 'tungsten',
  exposure: 'night',
  ISO: 100,
  log: () => {},
});

let startTime = now();

camera.on('start', () => {
  //console.log("Capturing Image");
});

camera.on('read', (err, timestamp, filename) => {
  // console.log("Image Taken");
  // console.log("   " + timestamp);
  // console.log("   " + moment(timestamp).format());
  // console.log("   " + filename);
  // console.log((now() - startTime));
});

setInterval(() => {
  let filename = "timelapse/image_" + moment().format("YYYY-MM-DD_HH.mm.ss") + ".jpg";
  camera.set('output', filename);
  camera.start();
}, 60000);


// ifx.forEach((option, index) => {
//   setTimeout(() => {
//     let filename = "image_" + index + "_" + option + "_" + moment().format("YYYY-MM-DD_HH.mm.ss") + ".jpg";
//     camera.set('imxfx', option);
//     camera.set('output', filename);
//     camera.start();
//   }, 2000 * index);
// });
