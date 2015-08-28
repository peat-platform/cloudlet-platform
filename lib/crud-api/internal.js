/*
 * peat_data_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dmccarthy
 */

'use strict';

var zmq         = require('m2nodehandler');

var internalWorker = function(config, senderToClient) {

    zmq.receiver(config.internal_crud_worker.source, config.internal_crud_worker.sink, function (msg) {
        //console.log("msg:" + JSON.stringify(msg));
        /*Your postprocessing here*/

        var b = msg.body;

        if (msg.body.response){
            b = msg.body.response;
        }
        senderToClient.send(msg.uuid, msg.connId, msg.status, msg.headers, b);
    });
};


module.exports = internalWorker;