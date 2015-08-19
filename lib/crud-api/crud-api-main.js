/*
 * peat_data_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dmccarthy
 */

'use strict';

var zmq    = require('m2nodehandler');
//var rrd    = require('peat-rrd');

var peatLogger  = require('peat-logger');
var peatUtils   = require('cloudlet-utils');
var helper      = require('./helper.js');
var https       = require('https');
//var loglet    = require('loglet');
var uuid        = require('uuid');

//loglet = loglet.child({component: 'crud-api'});

var logger;

var crudApi = function(config) {

   logger = peatLogger(config.logger_params);
   //rrd.init("crud");
   //zmq.addPreProcessFilter(rrd.filter);

   var senderToDao    = zmq.sender(config.dao_sink);
   var senderToClient = zmq.sender(config.mongrel_handler.sink);

    zmq.receiver(config.crud_api_handler.source, config.crud_api_handler.sink, function (msg) {
        //console.log("msg:" + JSON.stringify(msg));
        /*Your postprocessing here*/
        var b = msg.body.response;
        senderToClient.send(msg.uuid, msg.connId, msg.status, msg.headers, b);
    });

   zmq.receiver(config.mongrel_handler.source, config.mongrel_handler.sink, function(msg) {

      helper.processMessage(msg,senderToDao,senderToClient)
   });

};


module.exports = crudApi;