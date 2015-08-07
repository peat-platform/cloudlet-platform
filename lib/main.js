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
var typeApi       = require('./type-api/type-api-main');

var path          = require('path');
var swaggerDef    = require('swagger-def');
var dao           = require('dao');
var redirect      = require('./https_redirect.js');
var aggregator    = require('peat-aggregator');

var platformConfig        = require('./config');

var jwt               = require('jsonwebtoken');
var zmq               = require('m2nodehandler');


zmq.setMongrel2UploadDir("/opt/peat/cloudlet_platform/" );

var cloudletPlatform = function(config){

   var senderToDao    = zmq.sender(config.platform);
   var senderToClient = zmq.sender(config.platform.mongrel_handler.sink);

   console.log("---")
   console.log(config.platform.mongrel_handler)

   zmq.receiver(config.platform.mongrel_handler.source, config.platform.mongrel_handler.sink, function(msg) {

      console.log("-----MESSAGE-----");

      console.log(msg)
   });
};


cloudletPlatform(platformConfig);
redirect(platformConfig.redirect_config);


