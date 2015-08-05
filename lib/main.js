/*
 * cloudlet_platform
 *
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
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
//var rrd           = require('peat-rrd');
var aggregator    = require('peat-aggregator');

var config        = require('./config');


process.setMaxListeners(100);

process.on('uncaughtException', function (er) {
   console.error(er);
   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});

//rrd.init(config.monitoring_config);
aggregator(config.aggregator_config);
dao.dao_proxy(config.dao_proxy_config);
dao.dao_proxy(config.dao_perms_propagator_config);
dao.dao_proxy(config.tracklet_proxy_config);
dao.perms_prop_worker(config.perms_propagator_b);
cloudletApi(config.cloudlet_config);
objectApi(config.object_config);
attachmentApi(config.attachment_config);
searchApi(config.search_config);
typeApi(config.type_config);
permsApi(config.perms_config);
permsApi(config.public_perms_config);
swaggerDef(config.swagger_def_config);
swaggerDef(config.http_swagger_def_config);
notifApi(config.notif_config);
authApi(config.auth_config);
crudApi(config.crud_config);
dao(config.dao_config);
redirect(config.redirect_config);
