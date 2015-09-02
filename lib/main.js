/**
 * Created by dconway on 07/08/15.
 */


'use strict';
console.time("startup");

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
var zmq_proxy         = require('./utils/zmq_proxy')
var redirect          = require('./utils/https_redirect.js');

var swaggerDef    = require('swagger-def');
var dao           = require('dao');


var loglet        = require('cloudlet-utils').loglet;
var conf          = require('./config');

var peatUtils        = require('cloudlet-utils').cloudlet_utils;
var jwt              = require('jsonwebtoken');
var zmq              = require('m2nodehandler');


var logger = loglet.createLogger(conf.logging.name, conf.logging.log_level, conf.logging.log_file_name)


process.setMaxListeners(50);

process.on('uncaughtException', function (er) {

   logger.error(er)

   if (undefined !== er){
      logger.error(er.stack)
   }
   process.exit(1);
});


logger.info("testing logger")

zmq.setMongrel2UploadDir("/opt/peat/cloudlet_platform/" );

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

var senderToDao       = zmq.sender(conf.platform.dao_sink);
var senderToClient    = zmq.sender(conf.platform.mongrel_handler.sink);
var senderToIntClient = zmq.sender(conf.internal_platform.mongrel_handler.sink);

var cloudletPlatformInternal = function(config){

   zmq.receiver(config.internal_platform.mongrel_handler.source, config.internal_platform.mongrel_handler.sink, function(msg) {

      logIncoming(logger, msg)

      var endpoint = getEndpoint(msg.path);

      logger.debug("endpoint", endpoint);

      switch (endpoint){
      case "crud":
         crudApi.processMessage(msg, senderToDao, senderToIntClient, config.internal_platform)
         break;
      case "permissions":
      case "app_permissions":
         permsApi.processMessage(msg, senderToDao, senderToIntClient, config.internal_platform);
         break;
      default:
         senderToIntClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {'error' : 'Endpoint not found' });
         break;
      }
   }, logger);
};


var logIncoming = function(logger, msg){

   logger.debug(msg)

   if (logger.levels(0) > 20){

      var info = {
         title  : "incoming",
         uuid   : msg.uuid,
         connId : msg.connId,
         path   : msg.path,
         method : msg.headers['METHOD'],
         ip     : msg.headers['x-forwarded-for'],
         remote : msg.headers['REMOTE_ADDR'],
         agent  : msg.headers['user-agent'],
         json   : (null !== msg.json) ? Object.keys(msg.json) : null
      }

      logger.info(info)
   }


}

var cloudletPlatform = function(config){

   subsApi.init(config.platform, logger);
   cloudletApi.init(logger)
   searchApi.init(logger)
   extAuthApi.init(logger)
   typeApi.init(logger)
   searchApi.init(logger)

   zmq.receiver(config.platform.mongrel_handler.source, config.platform.mongrel_handler.sink, function(msg) {

      logIncoming(logger, msg)

      var path     = msg.path;
      var endpoint = getEndpoint(msg.path);

      switch (endpoint){
      case "types":
         typeApi.processMongrel2Message(msg, senderToDao, senderToClient, config.platform.mongrel_handler.sink);
         break;
      case "objects":
         objectApi.processMessage(msg, senderToDao, senderToClient, config.platform)
         break;
      case "attachments":
         attachmentApi.processMessage(msg, senderToDao, senderToClient, config.platform);
         break;
      case "cloudlets":
         cloudletApi.processMessage(msg, senderToDao, senderToClient,config.platform);
         break;
      case "search":
         searchApi.processMessage(msg, senderToDao, senderToClient, config.platform);
         break;
      case "auth":
         extAuthApi.processMessage(msg, senderToDao, senderToClient, config.platform);
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


zmq_proxy.create_proxy(conf.dao_proxy_config            );
zmq_proxy.create_proxy(conf.dao_perms_propagator_config );
zmq_proxy.create_proxy(conf.tracklet_proxy_config       );

intAuthApiWorker (conf.platform,          senderToDao, senderToClient, logger);
intPermsApiWorker(conf.internal_platform, senderToDao, senderToIntClient     );
intCrudApiWorker (conf.internal_platform, senderToIntClient                  );

cloudletPlatform         (conf);
cloudletPlatformInternal (conf)

redirect(conf.redirect_config);
swaggerDef(conf.swagger_def_config);
swaggerDef(conf.http_swagger_def_config);

dao.perms_prop_worker(conf.perms_propagator_b, logger);
dao(conf.dao_config);

console.timeEnd("startup");



