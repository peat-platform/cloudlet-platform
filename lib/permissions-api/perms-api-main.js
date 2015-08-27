'use strict';

var jwt      = require('jsonwebtoken');
var zmq      = require('m2nodehandler');
var helper   = require('./helper.js');
var internal = require('./internalWorker.js');


var processMessage = function (config, msg, senderToClient, senderToDao) {

   var daoMsg = helper.processMongrel2Message(msg, senderToDao, function (err) {
      senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, { "error": err });

   });

   if ( undefined !== daoMsg ) {
      daoMsg.mongrel_sink = config.mongrel_handler.sink;
      senderToDao.send(daoMsg);
   }

};


var permissionsApi = function (config, senderToDao, senderToClient) {

   helper.init(config);

   internal(config, senderToDao, senderToClient);

};


module.exports.processMongrel2Message = processMongrel2Message;
module.exports.initnternal            = processMongrel2Message;