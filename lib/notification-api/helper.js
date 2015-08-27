/*
 * peat_notif_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dconway, dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

//var zmqM2Node = require('m2nodehandler');
//var dbc = require('dbc');
var peatLogger = require('peat-logger');
var logger;

var dbc         = require('dbc');
var peatLogger = require('peat-logger');
var couchbase   = require('couchbase');
var peatUtils  = require('cloudlet-utils');
var zmq         = require('m2nodehandler');
var http        = require('http');
var https       = require('https');
var loglet      = require('loglet');
var GCM         = require('gcm').GCM;

loglet = loglet.child({component: 'notifications'});

var gcm;
var logger;
var sendToMongrel2;
var sendToCommunications;

var cluster = null;
var bucket  = null;
var dbs     = {};

var sse_connections = {};


var init = function (logger_params) {
   logger = peatLogger(logger_params)
};


var getAction = function (method) {

   method = method.toLowerCase();
   var res = null;

   switch (method) {
   case 'post':
      res = 'PUT';
      break;
   case 'put':
      res = 'PUT';
      break;
   case 'get':
      res = 'GET';
      break;
   }


   return res;
};


var getAccess = function (path) {

   var parts = path.split('/');
   var namePos = 3;

   return parts[namePos]
};


var getCloudlet = function (path) {

   var parts = path.split('/');
   var cletPos = 4;
   return parts[cletPos];

};


var getObject = function (path) {

   var parts = path.split('/');
   var namePos = 5;

   return parts[namePos];

};

var buildPEATSubscription = function(client_id,type,notification_type,data,endpoint){
   var subscription = {

   }


   var PEATSub = {
      "@type": "t_a79935280b04170ebf2fc263e4385ffc-739",
      "@data": subscription
   }
}


var checkSubscriptions = function (msg) {
	console.log('Check Subs');
   getSubscriptions(msg)
};

/**
 *
 * @type {Function}
 */
var createAppSubscriptions = function(msg){

   var token = msg.token
   var result = msg.result

   var sub = {
      json : '',
      path : token.cloudlet,
      token: token
   }

   var json = {}

   for( var r in result ){

      if(result[r]['@data'] !== undefined)
      {
         json.cloudletid = token.cloudlet
         json.typeid = result[r]['@data']['type'].trim()
         json.notification_type = result[r]['@data']['notification_type']
         if ( result[r]['@data']['endpoint'] !== undefined ) {
            json.endpoint = result[r]['@data']['endpoint']
         }
         if ( result[r]['@data']['data'] !== undefined ) {
            json.data = result[r]['@data']['data']
         }

         sub.json = json

         postSub(sub, function (err, res) {
            if (res['error'] !== undefined) {
               console.log("CreateAppSubscription Error: " + res['error'])
            }
         });
      }

      json = {}
   }


}

/**
 * Get subscriptions for update object/cloudlet trigger sent from DAO
 * @param msg
 */
var getSubscriptions = function (msg) {
   msg.count    = (typeof msg.count !== 'number' || isNaN(msg.count) || msg.count > 50) ? 50 : msg.count;
   msg.skip     = (typeof msg.skip !== 'number' || isNaN(msg.skip)) ? 0 : msg.skip;
   msg.startkey = typeof msg.startkey !== 'string' ? '' : msg.startkey;
   var endkey   = (msg.objectId !== undefined) ? [msg.cloudletid, msg.objectId] : [msg.cloudletid, null];

   var ViewQuery = couchbase.ViewQuery;
   var query = ViewQuery.from('subscription_views', 'subs')
      .skip(msg.skip)
      .limit(msg.count)
      .stale(ViewQuery.Update.BEFORE)
      .range([msg.cloudletId, null], [msg.cloudletId+"^",null], true);

   if (undefined !== msg.reduce && msg.reduce) {
      query.reduce(msg.reduce)
   }
   else {
      query.reduce(false)
   }

   if (undefined !== msg.group_level) {
      query.group(msg.group_level)
   }
   delete query.options.group;

   bucket.query(query, function (err, res) {


      if (err) {
         loglet.error(err);
      }

      if (res !== null) {
         for (var i = 0; i < res.length; i++) {
            res[i].subId = res[i].id.split('+')[1];
            res[i].objectId = msg.objectId;
            processSubscription(res[i])
         }
      }
   });
};

var processMessage = function(msg, senderToDao, senderToClient, config){
   if(msg.type !== undefined && msg.type === 'appSubs'){
      createAppSubscriptions(msg);
   }
   else {
      getSubscriptions(msg)
   }
};


module.exports.init                   = init;
module.exports.getAction              = getAction;
module.exports.getAccess              = getAccess;
module.exports.getCloudlet            = getCloudlet;
module.exports.checkSubscriptions     = checkSubscriptions;
module.exports.createAppSubscriptions = createAppSubscriptions;
module.exports.getSubscriptions       = getSubscriptions;
