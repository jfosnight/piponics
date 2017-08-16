# PiPonics
Raspberry Pi and Node.js Based Hydroponics System

## Description
For the first iteration I decided to go for a [Flood and Drain (Ebb and Flow)](http://www.homehydrosystems.com/hydroponic-systems/ebb-flow_systems.html) system.

The current setup consists of a water pump in a large reservoir tank position on the bottom of a cart.  On the top self I have a tub with two ports on the bottom side. One for inflow and one for the drain.  The inflow port is mostly flush with the inside of the tub and is connected to the pump.  The drain has a stem about 3 1/2 inches high sticking up into the tub.  The other end of the drain, empties into the reservoir tank.

The water pump and grow lamp are both 120V AC, so I have a 2 channel solid state relay board wired up to the Pi to allow control via the GPIO pins.  

## Progress
For now this script controls two primary components: the pump and the lamp.  The pump is cycled every 15 minutes (meaning it's on for 15 min, and then off for 15 min).  The lamp is setup for a 16-hr growing period and is setup to turn on at 7:00 am and off at 9:00 pm.

Additionally, I have a 128x64 OLED screen hooked up via i2c.  This displays the current time, and the current state of the pump and light.  It also shows the time remaining until the pump state is toggled.

The script is using Johnny-five to for the GPIO control.
