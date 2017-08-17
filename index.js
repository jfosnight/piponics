const moment = require('moment');
const Raspi = require('raspi-io');
const five = require('johnny-five');
const Oled = require('oled-js');
const font = require('oled-font-5x7');
const board = new five.Board({
  io: new Raspi(),
  repl: false
});


let config = {
  pumpDelay: 15 * 60, // seconds
  lampOnTime: parseStrTime("07:00:00"), // 7 AM
  lampOffTime: parseStrTime("23:00:00"), // 11 PM
};


board.on('ready', execute);

function execute(){
  let light1 = new five.Led('GPIO21');
  let opts = {
    width: 128,
    height: 64,
    address: 0x3C,
  };
  let oled = new Oled(board, five, opts);
  let lightState = false;

  console.log("Starting");

  // Clear the display;
  oled.fillRect(1,1,128,64,0);

  /*
  // Toggle Light
  setInterval(() => {
    oled.setCursor(1,16);
    let str;

    if(lightState){
      light1.off();
      lightState = false;
      str = "Pump: Off";
    } else {
      light1.on();
      lightState = true;
      str = "Pump: On";
    }
  }, 4000);
  */


  // Update Clock every 200 ms
  setInterval(() => {
    updateTime(oled);
  }, 200);

  // Start the Pump Cycle
  startPump(oled);

  // Start Lamp Cycle
  startLamp(oled);
};


function startPump(oled){
  let pump = new five.Led('GPIO20');
  let state = 'off';
  let delay = config.pumpDelay; // Seconds
  let remaining = delay;

  setInterval(() => {
    let str = "Pump: ";

    if(remaining <= 0){
      state = toggleState(state, pump);
      remaining = delay;
    } else {
      remaining--;
    }

    str += state === 'on' ? 'On' : 'Off';
    //str += ' ';
    //str += formatTime(remaining);

    // oled.drawRect(1,16,128,26,0);
    oled.setCursor(1, 16);
    oled.writeString(font, 1, str, 1, false, 2);

    let timeStr = formatTime(remaining);
    let offset = Math.floor(128 - (timeStr.length * 7));
    oled.setCursor(offset, 16);
    oled.writeString(font, 1, timeStr, false, 2);
  }, 1000);
}

function startLamp(oled){
  let lamp = new five.Led('GPIO21');
  let state = 'off';
  // let delay = 15; // Seconds
  //let remaining = delay;

  setInterval(() => {
    let now = moment();
    let currentTime = {
      hour: now.hour(),
      min: now.minute(),
      sec: now.second(),
    }
    // console.log(currentTime);
    let cts = currentTime.hour * 3600 + currentTime.min * 60 + currentTime.sec; // Current Time in Seconds

    // console.log(cts);
    // console.log(config);

    let state = 'off';

    if( config.lampOnTime < cts && cts < config.lampOffTime){
      state = 'on';
    }

    let str = "Lamp: ";

    if(state === 'on'){
      lamp.on();
      str += "On";
    } else {
      lamp.off();
      str += "Off";
    }

    oled.setCursor(1, 32);
    oled.writeString(font, 1, str, 1, false, 2);

  }, 5000);

  // setInterval(() => {
  //   let str = "Lamp: ";
  //
  //   if(remaining <= 0){
  //     state = toggleState(state, lamp);
  //     remaining = delay;
  //   } else {
  //     remaining--;
  //   }
  //
  //   str += state === 'on' ? 'On' : 'Off';
  //
  //   oled.setCursor(1, 30);
  //   oled.writeString(font, 1, str, 1, false, 2);
  //
  //   // Draw Countdown Timer
  //   let timeStr = formatTime(remaining);
  //   let offset = Math.floor(128 - (timeStr.length * 7));
  //   oled.setCursor(offset, 30);
  //   oled.writeString(font, 1, timeStr, false, 2);
  // }, 1000);
}

function formatTime(seconds){
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;

  str = '';
  if(min < 10){
    str += '0' + min;
  } else {
    str += min;
  }

  str += ':';

  if(sec < 10){
    str += '0' + sec;
  } else {
    str += sec;
  }

  return str;
}

function toggleState(state, device){
  if(state === 'off'){
    device.on();
    return 'on';
  } else {
    device.off();
    return 'off';
  }
}


function updateTime(oled){
  let now = moment().format('HH:mm:ss MM/DD/YY');
  let x = Math.floor( (128 - (now.length * 6)) / 4);
  oled.setCursor(x,1);
  oled.writeString(font, 1, now, 1, 0, 0);
}

function parseStrTime(str){
  let parts = str.split(':');
  let time = {
    hour: 0,
    min: 0,
    sec: 0,
  };

  if(parts.length === 1){
    time.hour = Number(parts[0]);
  } else if (parts.length === 2){
    time.hour = Number(parts[0]);
    time.min = Number(parts[1]);
  } else if (parts.length === 3){
    time.hour = Number(parts[0]);
    time.min = Number(parts[1]);
    time.sec = Number(parts[2]);
  }

  return time.hour * 3600 + time.min * 60 + time.sec;
}
