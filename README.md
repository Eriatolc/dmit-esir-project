dmit-esir-project
=================

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

### Communication

The communication between the belt and the Nodejs server is done through a [`Zigbee` wireless network]() to an intermediate Arduino, which will transmit the data to the server. In the other hand, the SensorTag send the data directly to the server using Bluetooth Low Energy (BLE).
The server is connected to the Arduino by USB.

## Requirement of this projet

 * OS: Linux or Mac OS
 * Installation of [`noble`](https://npmjs.org/package/noble) functionnal.