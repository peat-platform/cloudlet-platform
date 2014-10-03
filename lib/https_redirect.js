'use strict';

var zmq    = require('m2nodehandler');

var redirect = function(){

   var in_m  = { spec:'tcp://127.0.0.1:50000', bind:false, type: 'pull',  isMongrel2:true, id:'ra' }
   var out_m = { spec:'tcp://127.0.0.1:50001', bind:false, type: 'pub',  isMongrel2:true, id:'rb' }

   var responseHandler = zmq.sender(out_m);

   zmq.receiver(in_m, out_m, function(msg) {

      responseHandler.send(msg.uuid, msg.connId, 302, { "Location" : "https://" + msg.headers.host + msg.headers.URI }, "" );

   });

}

module.exports = redirect