/**
 * Created by dconway on 07/08/15.
 */


'use strict';
var attachmentApi     = require('./attachment-api/helper');
var extAuthApi        = require('./auth-api/mongrel2MsgHandler');
var intAuthApiWorker  = require('./auth-api/internalWorker');
var cloudletApi       = require('./cloudlet-api/helper');
var crudApi           = require('./crud-api/helper');
var intCrudApiWorker  = require('./crud-api/internal');
var notifApi          = require('./notification-api/subscription_helper');
var subsApi           = require('./notification-api/subscription_helper');
var objectApi         = require('./object-api/helper');
var permsApi          = require('./permissions-api/helper');
var intPermsApiWorker = require('./permissions-api/internalWorker');
var searchApi         = require('./search-api/helper');
var typeApi           = require('./type-api/helper');

var peatLogger  = require('peat-logger');
var swaggerDef    = require('swagger-def');
var dao           = require('dao');
var redirect      = require('./https_redirect.js');
var aggregator    = require('peat-aggregator');

var platformConfig        = require('./config');

var peatUtils        = require('cloudlet-utils');
var jwt               = require('jsonwebtoken');
var zmq               = require('m2nodehandler');


process.setMaxListeners(50);


process.on('uncaughtException', function (er) {

   console.error(er);

   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});


zmq.setMongrel2UploadDir("/opt/peat/cloudlet_platform/" );

var logger = peatLogger(platformConfig.platform.logger_params);

var getEndpoint = function(path){
   if(path.indexOf("/api/v1/types") >= 0){
      return "types"
   }
   else if(path.indexOf("/api/v1/objects") >= 0){
      return "objects"
   }
   else if(path.indexOf("/api/v1/attachments") >= 0){
      return "attachments"
   }
   else if(path.indexOf("/api/v1/cloudlets") >= 0){
      return "cloudlets"
   }
   else if(path.indexOf("/api/v1/permissions") >= 0){
      return "permissions"
   }
   else if(path.indexOf("/api/v1/app_permissions") >= 0){
      return "app_permissions"
   }
   else if(path.indexOf("/api/v1/search") >= 0){
      return "search"
   }
   else if(path.indexOf("/api/v1/auth") >= 0){
      return "auth"
   }
   else if(path.indexOf("/api/v1/subs") >= 0){
      return "subs"
   }
   else if(path.indexOf("/api/v1/sse") >= 0){
      return "sse"
   }
   else if(path.indexOf("/api/v1/crud") >= 0){
      return "crud"
   }
}

var senderToDao       = zmq.sender(platformConfig.platform.dao_sink);
var senderToClient    = zmq.sender(platformConfig.platform.mongrel_handler.sink);
var senderToIntClient = zmq.sender(platformConfig.internal_platform.mongrel_handler.sink);

var cloudletPlatformInternal = function(config){

   zmq.receiver(config.internal_platform.mongrel_handler.source, config.internal_platform.mongrel_handler.sink, function(msg) {

      var path = msg.path;

      var endpoint = getEndpoint(msg.path);

      console.log("endpoint", endpoint);

      switch (endpoint){
      case "crud":
         crudApi.processMessage(msg, senderToDao, senderToIntClient, config.internal_platform, logger)
         break;
      case "permissions":
      case "app_permissions":
         permsApi.processMessage(msg, senderToDao, senderToIntClient, config.internal_platform);
         break;
      default:
         senderToIntClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {'error' : 'Endpoint not found' });
         break;
      }
   });
};


var cloudletPlatform = function(config){

   subsApi.init(config.platform);

   zmq.receiver(config.platform.mongrel_handler.source, config.platform.mongrel_handler.sink, function(msg) {

      var path     = msg.path;
      var endpoint = getEndpoint(msg.path);

      console.log("endpoint", endpoint);

      switch (endpoint){
      case "types":
         typeApi.processMongrel2Message(msg, senderToDao, senderToClient, config.platform.mongrel_handler.sink,logger);
         break;
      case "objects":
         objectApi.processMessage(msg, senderToDao, senderToClient, config.platform)
         break;
      case "attachments":
         attachmentApi.processMessage(msg, senderToDao, senderToClient, config.platform);
         break;
      case "cloudlets":
         cloudletApi.processMessage(msg, senderToDao, senderToClient,config.platform, logger);
         break;
      case "search":
         searchApi.processMessage(msg, senderToDao, senderToClient, config.platform, logger);
         break;
      case "auth":
         extAuthApi.processMessage(msg, senderToDao, senderToClient, config.platform, logger);
         break;
      case "subs":
         subsApi.processMessage(msg, senderToDao, senderToClient,config.platform, path);
         break;
      case "sse":
         notifApi.processMessage(msg, senderToDao, senderToClient,config.platform, path);
         break;
      default:
         senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {'error' : 'Endpoint not found' });
         break;
      }
   });
};


intAuthApiWorker (platformConfig.platform,          senderToDao, senderToClient);
intPermsApiWorker(platformConfig.internal_platform, senderToDao, senderToIntClient);
intCrudApiWorker (platformConfig.internal_platform, senderToIntClient);

cloudletPlatform         (platformConfig);
cloudletPlatformInternal (platformConfig)

redirect(platformConfig.redirect_config);
aggregator(platformConfig.aggregator_config);
dao.dao_proxy(platformConfig.dao_proxy_config);
dao.dao_proxy(platformConfig.dao_perms_propagator_config);
dao.dao_proxy(platformConfig.tracklet_proxy_config);
dao.perms_prop_worker(platformConfig.perms_propagator_b);
swaggerDef(platformConfig.swagger_def_config);
swaggerDef(platformConfig.http_swagger_def_config);
dao(platformConfig.dao_config);


