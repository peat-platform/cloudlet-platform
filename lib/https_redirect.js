'use strict';

var zmq    = require('m2nodehandler');

var redirect = function(conf){

   var responseHandler = zmq.sender(conf.out_m);

   zmq.receiver(conf.in_m, conf.out_m, function(msg) {

      responseHandler.send(msg.uuid, msg.connId, 302, { "Location" : "https://" + msg.headers.host + msg.headers.URI }, "" );

   });

};

module.exports = redirect;