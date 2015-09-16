This turns on the lights in a conference room when someone walks into an empty room.

When someone gets near enough to our Raspberry Pi with their BLE enabled device, the USB adapter picks it up and communicates with the Hue bridge over the network to turn on the light. After a set amount of time without seeing the device again, the light turns off, assuming the person is no longer there.

We used Node, BlueZ and a few other components.
Everything is hosted on a Raspberry Pi running Raspbian with a Bluetooth adapter to control the lights. 

