dmit-esir-project
=================

## TL;DR 

	sudo node bin/dmit-esir-project.js

## Introduction	

Domotic server to detect falls and rise alerts message to an Arduino system. This project is made by a group of students of the [ESIR Engineering School](https://esir.univ-rennes1.fr/) in the biomedical engineering speciality.

## Objectives of the projects

The main goal of this project is to create a telemonitoring system in order to follow some patients' physiological signals day after day. These data will be processed and alerts would be triggered if some problems happened to the patient.

This project currently monitor the heart rate of the patient and his balance to detect the patients movements (falls especially).

## Global architecture

### Sensors

We are using some sensors to monitor the patient:

 * Heart rate is monitored through a belt;
 * Balance is monitored through the accelerometer and the gyroscope of the [SensorTag](http://processors.wiki.ti.com/index.php/Bluetooth_SensorTag) from Texas Instrument.

### Server

The server which gathers the data and process them is a [`nodejs` server](http://nodejs.org/). In reaction, it will (or not) trigger actions through an [`Arduino`](http://arduino.cc/fr/) system. Actions can be such things as "call a doctor" if the patient has fallen for example.

### SensorTag Deamon

This deamon will communicate with the `SensorTag` during all the time the application is launched. It will monitor `SensorTag`'s data and give alerts to the `Server`.

### Communication

The communication between the belt and the Nodejs server is done through a [`Zigbee` wireless network]() to an intermediate Arduino, which will transmit the data to the server. In the other hand, the SensorTag send the data directly to the deamon using Bluetooth Low Energy (BLE). The communication between the Server and the Deamon is not still decided.
The server is connected to the Arduino by USB.

## Requirement of this projet

 * OS: Linux, Mac OS or Windows
 * Installation of [`nodejs`](http://nodejs.org/),
 * Installation of [`noble`](https://npmjs.org/package/noble) functionnal,
 * A [SensorTag](http://processors.wiki.ti.com/index.php/Bluetooth_SensorTag) from Texas Instruments,
 * A Bluetooth 4.0 Low Energy dongle to communicate with the `SensorTag`.

### Installing `nodejs`

Node.js is a server-side framework who allows you to use JavaScript on this side. You can follow the detailed [download](http://nodejs.org/download/) and all the install instructions on the [Node.js](http://i.imgur.com/xVyoSl.jpg) website.

Node.js comes with a little package manager for its modules. It is called `npm` for Node Package Manager. It is accessible by the `npm` command. Be sure you have it after the installation of Node.js, we will need it after.

## Installation guide

We are assuming that you are running an OS with Node.js enabled and you have to adapt the following commands to your own package manager.

	cd dmit-esir-project/	# Go to the project directory
	sudo npm install 		# Install all the dependencies required

## Execution

	sudo node bin/dmit-esir-project.js

This command will start the webserver and the SensorTag deamon. But you can start the webserver on a custom port using the following command:

	sudo node bin/dmit-esir-project.js --port 8080

To see the available options, use the `--help` command:

	sudo node bin/dmit-esir-project.js --help



