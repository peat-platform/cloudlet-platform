/**
 * Created by dconway on 07/08/15.
 */


'use strict';
var attachmentApi = require('./attachment-api/attachment-api-main');
var authApi       = require('./auth-api/auth-api-main');
var cloudletApi   = require('./cloudlet-api/cloudlet-api-main');
var crudApi       = require('./crud-api/crud-api-main');
var notifApi      = require('./notification-api/notification-api-main');
var objectApi     = require('./object-api/object-api-main');
var permsApi      = require('./permissions-api/perms-api-main');
var searchApi     = require('./search-api/search-api-main');
var typeApi       = require('./type-api/helper');

var peatLogger  = require('peat-logger');
//var path          = require('path');
var swaggerDef    = require('swagger-def');
var dao           = require('dao');
var redirect      = require('./https_redirect.js');
var aggregator    = require('peat-aggregator');

var platformConfig        = require('./config');

var peatUtils        = require('cloudlet-utils');
var jwt               = require('jsonwebtoken');
var zmq               = require('m2nodehandler');


zmq.setMongrel2UploadDir("/opt/peat/cloudlet_platform/" );

var logger = peatLogger(platformConfig.platform.logger_params);


var cloudletPlatform = function(config){

   var senderToDao    = zmq.sender(config.platform.dao_sink);
   var senderToClient = zmq.sender(config.platform.mongrel_handler.sink);


   zmq.receiver(config.platform.mongrel_handler.source, config.platform.mongrel_handler.sink, function(msg) {

      console.log("-----MESSAGE-----");

      console.log(msg);

      var path = msg.path;


      if(path.indexOf("types") >= 0){
         typeApi.processMongrel2Message(msg, senderToDao, senderToClient, config.platform.mongrel_handler.sink,logger);
      }
      if(path.indexOf("objects") >= 0){
         if ( undefined === msg.headers.authorization ){
            senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {"error":"Missing Auth token: " });
            return
         }

         var tokenB64 = msg.headers.authorization.replace("Bearer ", "");

         jwt.verify(tokenB64, config.trusted_security_framework_public_key, function(err, token) {

            if (undefined !== err && null !== err){
               senderToClient.send(msg.uuid, msg.connId, zmq.status.BAD_REQUEST_400, zmq.standard_headers.json, {"error":"Invalid token: " + err });
            }
            else {
               if (token){
                  if ("session" === token["peat-token-type"]){
                     token["context"] = token["cloudlet"]
                  }
                  msg.token = token;
               }
               helper.processMongrel2Message(msg, senderToDao, senderToClient, config.mongrel_handler.sink);
            }
         });

      }
      

   });
};


cloudletPlatform(platformConfig);
redirect(platformConfig.redirect_config);
//rrd.init(config.monitoring_config);
aggregator(platformConfig.aggregator_config);
dao.dao_proxy(platformConfig.dao_proxy_config);
dao.dao_proxy(platformConfig.dao_perms_propagator_config);
dao.dao_proxy(platformConfig.tracklet_proxy_config);
dao.perms_prop_worker(platformConfig.perms_propagator_b);
//permsApi(config.perms_config);
//permsApi(config.public_perms_config);
swaggerDef(platformConfig.swagger_def_config);
swaggerDef(platformConfig.http_swagger_def_config);
dao(platformConfig.dao_config);


