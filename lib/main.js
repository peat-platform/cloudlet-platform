/**
 * Created by dconway on 07/08/15.
 */


'use strict';
var attachmentApi = require('./attachment-api/helper');
var extAuthApi      = require('./auth-api/mongrel2MsgHandler');
var intAuthApi      = require('./auth-api/internalWorker');
var cloudletApi   = require('./cloudlet-api/helper');
var crudApi       = require('./crud-api/helper');
var notifApi      = require('./notification-api/notification-api-main');
var objectApi     = require('./object-api/helper');
var permsApi      = require('./permissions-api/helper');
var pubPermsApi   = require('./permissions-api/perms-api-main');
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

   intAuthApi(config.platform, senderToDao, senderToClient);

   zmq.receiver(config.platform.mongrel_handler.source, config.platform.mongrel_handler.sink, function(msg) {

      //console.log("-----MESSAGE-----");

      //console.log(msg);

      var path = msg.path;

      if(path.indexOf("types") >= 0){
         typeApi.processMongrel2Message(msg, senderToDao, senderToClient, config.platform.mongrel_handler.sink,logger);
      }
      if(path.indexOf("objects") >= 0){
         objectApi.processMessage(msg, senderToDao, senderToClient, config.platform)

      }
      if(path.indexOf("attachments") >= 0){
         attachmentApi.processMessage(msg, senderToDao, senderToClient, config.platform);
      }
      if(path.indexOf("cloudlets") >= 0){
         cloudletApi.processMessage(msg, senderToDao, senderToClient,config.platform, logger);
      }
      if(path.indexOf("crud") >= 0){
         crudApi.processMessage(msg,senderToDao,senderToClient,config.platform, logger)
      }
      if(path.indexOf("permissions") >= 0){
         permsApi.processMessage(msg, senderToDao, senderToClient, config.platform);
      }
      if(path.indexOf("search") >= 0){
         searchApi.processMessage(msg, senderToDao, senderToClient, config.platform);
      }
      if(path.indexOf("auth") >= 0){
         extAuthApi.processMessage(msg, senderToDao, senderToClient,config.platform, logger);
      }
      /*if(path.indexOf("types") >= 0){
         typeApi.processMongrel2Message(msg, senderToDao, senderToClient, config.platform.mongrel_handler.sink,logger);
      }*/

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
pubPermsApi(platformConfig.public_perms_config);
swaggerDef(platformConfig.swagger_def_config);
swaggerDef(platformConfig.http_swagger_def_config);
dao(platformConfig.dao_config);


