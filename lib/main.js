/*
 * cloudlet_platform
 *
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';
var path          = require('path');
var swaggerDef    = require('swagger-def');
var cloudletApi   = require('cloudlet_api');
var objectApi     = require('object_api');
var attachmentApi = require('attachments_api');
var searchApi     = require('search_api');
var permsApi      = require('permissions_api');
var typeApi       = require('type_api');
var notifApi      = require('notifications');
var dao           = require('dao');
var redirect      = require('./https_redirect.js');
var authApi       = require('auth_api');
var crudApi       = require('crud_api');
var rrd           = require('openi_rrd');
var aggregator    = require('openi_aggregator');
var trackletworker = require('tracklet-worker');

var config        = require('./config')


process.setMaxListeners(100);

process.on('uncaughtException', function (er) {
   console.error(er);
   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});

rrd.init(config.monitoring_config)
aggregator(config.aggregator_config)
dao.dao_proxy(config.dao_proxy_config);
dao.dao_proxy(config.dao_perms_propagator_config);
dao.dao_proxy(config.tracklet_proxy_config);
dao.perms_prop_worker(config.perms_propagator_b);
cloudletApi(config.cloudlet_config);
objectApi(config.object_config);
attachmentApi(config.attachment_config)
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
trackletworker(config.tracklet_worker_conf)


