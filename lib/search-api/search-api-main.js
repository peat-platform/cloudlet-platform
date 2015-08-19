/*
 * object_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

var zmq               = require('m2nodehandler');
var helper            = require('./helper.js');
var path              = require('path');
var peatUtils        = require('cloudlet-utils');
var jwt               = require('jsonwebtoken');


if (undefined === global.appRoot){
   global.appRoot = path.resolve(__dirname);
}

var objectApi = function(config){

   helper.init(config.logger_params);

   var senderToDao    = zmq.sender(config.dao_sink);
   var senderToClient = zmq.sender(config.mongrel_handler.sink);

   zmq.receiver(config.mongrel_handler.source, config.mongrel_handler.sink, function(msg) {

      helper.processMessage(msg, senderToDao, senderToClient, config);
   });
};

module.exports = objectApi;
