/*
* object_api
* peat-platform.org
*
* Copyright (c) 2013 dmccarthy
* Licensed under the MIT license.
*/

'use strict';

var helper            = require('./helper.js');
var path              = require('path');
var rrd               = require('peat-rrd');
var peatUtils        = require('cloudlet-utils');
var jwt               = require('jsonwebtoken');
var zmq               = require('m2nodehandler');


var objectApi = function(config){

   rrd.startAPI(config.monitoring);
   zmq.addPreProcessFilter(rrd.msgfilter);

   var senderToDao    = zmq.sender(config.dao_sink);
   var senderToClient = zmq.sender(config.mongrel_handler.sink);

   zmq.receiver(config.mongrel_handler.source, config.mongrel_handler.sink, function(msg) {

      helper.processMessage(msg, senderToDao, senderToClient, config)
   });
}


module.exports = objectApi;
