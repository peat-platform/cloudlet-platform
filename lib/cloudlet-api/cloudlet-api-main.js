/*
 * peat_data_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

var jwt    = require('jsonwebtoken');
var zmq    = require('m2nodehandler');
var helper = require('./helper.js');


var init = function(log){
   helper.init(log);
}

var processMessage = function(config, msg, senderToClient, senderToDao){
   var daoMsg = helper.processMongrel2Message(msg, senderToClient);

   if ( null === daoMsg){
      return
   }

   if (undefined !== daoMsg && undefined !== daoMsg.error){
      senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, daoMsg);
   }
   else {
      daoMsg.mongrel_sink = config.mongrel_handler.sink;
      senderToDao.send(daoMsg);
   }
};


var cloudletApi = function(config){

   var senderToDao    = zmq.sender(config.dao_sink);
   var senderToClient = zmq.sender(config.mongrel_handler.sink);

   zmq.receiver(config.mongrel_handler.source, config.mongrel_handler.sink, function(msg) {

      if (undefined === msg.headers.authorization || null == msg.headers.authorization){
         senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {"error":"Auth token required" });
         return
      }

      var tokenB64 = msg.headers.authorization.replace("Bearer ", "");

      jwt.verify(tokenB64, config.trusted_security_framework_public_key, function(err, token) {

         if (undefined !== err && null !== err){
            senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {"error":"Invalid token: " + err });
         }
         else {
            if (token){
               msg.token = token;
            }
            processMessage(config, msg, senderToClient, senderToDao);
         }
      });
   });
};


module.exports      = cloudletApi;
module.exports.init = init