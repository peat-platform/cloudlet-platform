/*
* attachment_api
* peat-platform.org
*
* Copyright (c) 2013 dmccarthy
* Licensed under the MIT license.
*/

'use strict';

var helper            = require('./helper.js');
var path              = require('path');
var peatUtils        = require('cloudlet-utils');
var jwt               = require('jsonwebtoken');
var zmq               = require('m2nodehandler');


zmq.setMongrel2UploadDir("/opt/peat/cloudlet_platform/" );

var attachmentApi = function(config){

   var senderToDao    = zmq.sender(config.dao_sink);
   var senderToClient = zmq.sender(config.mongrel_handler.sink);

   zmq.receiver(config.mongrel_handler.source, config.mongrel_handler.sink, function(msg) {
      helper.processMessage(msg,senderToDao,senderToClient,config);
   });
};


module.exports = attachmentApi;
