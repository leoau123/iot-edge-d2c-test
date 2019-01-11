'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

var iotClient;
var count = 0;

Client.fromEnvironment(Transport, async function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', async function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(async function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');
        iotClient = client
        // Act on input messages to the module.
        /*client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });*/
        while(true){
          console.log("hi|"+count)
          let res = await sendIoTOutputEvent('output1', JSON.stringify({ date: new Date(), seq: count }), 'Test')
          console.log(res)
          count++
          await setTimeoutAsync(30000)
        }
      }
    });
  }
});

var setTimeoutAsync = async (delay) => {
  return new Promise((resolve, reject) => {
    if ((delay == null) || isNaN(delay) || delay < 0) {
      resolve(false);
    } else {
      setTimeout(() => { resolve(true) }, delay)
    }
  });
};

var sendIoTOutputEvent = async function (outputName, strMessage, msgType) {
  if (iotClient){
    let outputMsg = new Message(strMessage)
    outputMsg.properties.add('MessageType', msgType)

    return new Promise((resolve, reject) => {
      iotClient.sendOutputEvent(outputName, outputMsg, (err, res) => {
        if (err) {
          console.log("err", err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
