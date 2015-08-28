/*
 * peat_data_api
 * peat-platform.org
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

var dbc          = require('dbc');
var peatLogger  = require('peat-logger');
var peatUtils   = require('cloudlet-utils');
var url          = require('url');
var zmq          = require('m2nodehandler');
var jwt          = require('jsonwebtoken');


var getCloudletsForDeveloper = function(msg, senderToClient){

   var adminCloudletId = msg.token.cloudlet;

   var url_parts = url.parse(msg.headers.URI, true);
   var query     = url_parts.query;

   var limit  = (undefined !== query.limit)  ? Number(query.limit)   : 300;
   var offset = (undefined !== query.offset) ? Number(query.offset)  :  0;
   var prev   = msg.headers.URI.replace("offset="+offset, "offset="+ (((offset - limit) < 0) ? 0 : (offset - limit)));
   var next   = msg.headers.URI.replace("offset="+offset, "offset="+ (offset + limit));

   if (-1 === next.indexOf("offset=")){
      var prepend = (-1 === msg.headers.URI.indexOf('?')) ? "?" : "&"
      next         = msg.headers.URI + prepend + "offset="+ (offset + limit)
   }

   var meta = {
      "limit"       : limit,
      "offset"      : offset,
      "total_count" : 0,
      "prev"        : (0 === offset)? null : prev,
      "next"        : next
   };


   return {
      'dao_actions'      : [
         {
            'action'      : 'VIEW',
            'design_doc'  : 'objects_views',
            'view_name'   : 'object_by_cloudlet_id',
            'meta'        : meta,
            'filter_show' : query.only_show_properties,
            'resp_type'   : 'cloudlet',
            'start_key'   : [adminCloudletId],
            'end_key'     : [adminCloudletId + "^" ],
            'group'       : false,
            'group_level' : 2,
            'reduce'      : true,
            'id_only'     : false,
            'bucket'      : 'objects'
         }
      ],
      'clients'      : [
         {
            'uuid' : msg.uuid,
            'connId' : msg.connId
         }
      ]
   };

};


var getAllCloudlet = function(msg, senderToClient){

   var url_parts = url.parse(msg.headers.URI, true);
   var query = url_parts.query;

   var limit = (undefined !== query.limit) ? Number(query.limit) : 30;
   var offset = (undefined !== query.offset) ? Number(query.offset) : 0;
   var prev = msg.headers.URI.replace("offset=" + offset, "offset=" + (((offset - limit) < 0) ? 0 : (offset - limit)));
   var next = msg.headers.URI.replace("offset=" + offset, "offset=" + (offset + limit));

   var meta = {
      "limit"      : limit,
      "offset"     : offset,
      "total_count": 0,
      "prev"       : (0 === offset) ? null : prev,
      "next"       : next
   };

   return {
      'dao_actions': [
         {
            'action'     : 'VIEW',
            'design_doc' : 'cloudlets_views',
            'view_name'  : 'cloudlet_list',
            'meta'       : meta,
            'filter_show': query.only_show_properties,
            'resp_type'  : 'cloudlet',
            'group'      : false,
            'group_level': 1,
            'reduce'     : true,
            'bucket'     : 'objects'
         }
      ],
      'clients'    : [
         {
            'uuid'  : msg.uuid,
            'connId': msg.connId
         }
      ]
   };

};


var getCloudlet = function (msg, senderToClient){

   if(msg.token === undefined){
      return {'error' : 'Invalid Auth token: Invalid signature.'};
   }

   var cloudletId      = msg.token.cloudlet;

   if (!cloudletId){
      return {'error' : 'Invalid Auth token: Invalid signature.'};
   }

   var cloudletRestURL = '/api/v1/cloudlets/' + cloudletId;

   var cloudletDBObj = {
      "@id" : cloudletId
   };


   senderToClient.send(msg.uuid, msg.connId, zmq.status.OK_200, zmq.standard_headers.json, cloudletDBObj );

   return null
};


var processMongrel2Message = function (msg, senderToClient, logger) {

   logger.log('debug', 'process Mongrel 2 Message function');

   if (msg.headers.METHOD === 'GET'){
      if (msg.path === '/api/v1/cloudlets') {
         return getCloudlet(msg, senderToClient);
      }
      else if ( msg.path === '/api/v1/cloudlets/all') {
         return getAllCloudlet(msg, senderToClient);
      }
      else if ( msg.path === '/api/v1/cloudlets/all_dev'){
         return getCloudletsForDeveloper(msg, senderToClient);
      }
   }
   else{
      logger.log('debug', 'Matching function wasn\'t found');
   }
};

var processMessage = function(msg, senderToDao, senderToClient, config, logger){

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
         var daoMsg = processMongrel2Message(msg, senderToClient, logger);

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
      }
   });
};


module.exports.processMongrel2Message = processMongrel2Message;
module.exports.processMessage         = processMessage;
