/*
 * cloudlet_platform
 *
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

var argv  = require('commander')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

argv.version('0.0.1')
   .option('-w, --workers [value]', 'list of workers to start on this thread.')
   .on('--help', function(){
      console.log('  Examples:');
      console.log('');
      console.log('    node main_worker.js -w "dao object-api" ');
      console.log('');
   })
   .parse(process.argv);

if (!argv.workers){
   console.log('');
   console.log('Error: Missing parameters');
   console.log('');
   argv.help()
   return
}

var workers = argv.workers
var config  = require("./config")
var w       = workers.split(" ")


process.setMaxListeners(100);

process.on('uncaughtException', function (er) {
   console.error(er);
   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});

console.log("Starting", w)

for (var i = 0; i < w.length; i++){

   console.log("Starting", w[i])

   switch (w[i]){
   case 'dao_proxy':
      var dao  = require('dao');
      dao.dao_proxy(config.dao_proxy_config);
      break;
   case 'perms_propagator_proxy':
      var dao  = require('dao');
      dao.dao_proxy(config.dao_perms_propagator_config);
      break;
   case 'tracklet_proxy':
      var dao  = require('dao');
      dao.dao_proxy(config.tracklet_proxy_config);
      break;
   case 'peat_rrd':
      var rrd = require('peat_rrd');
      rrd.init(config.monitoring_config)
      break;
   case 'https_redirect':
      var redirect = require('./https_redirect.js');
      redirect(config.redirect_config);
      break;
   case 'swagger_def':
      var swaggerDef    = require('swagger-def');
      swaggerDef(config.swagger_def_config);
      swaggerDef(config.http_swagger_def_config);
      break;
   case 'cloudlet_api':
      var cloudletApi   = require('cloudlet_api');
      cloudletApi(config.cloudlet_config);
      break;
   case 'object_api':
      var objectApi     = require('object_api');
      objectApi(config.object_config);
      break;
   case 'attachments_api':
      var attachmentApi = require('attachments_api');
      attachmentApi(config.attachment_config)
      break;
   case 'search_api':
      var searchApi     = require('search_api');
      searchApi(config.search_config);
      break;
   case 'permissions_api':
      var permsApi      = require('permissions_api');
      permsApi(config.perms_config);
      permsApi(config.public_perms_config);
      break;
   case 'type_api':
      var typeApi       = require('type_api');
      typeApi(config.type_config);
      break;
   case 'notifications':
      var notifApi      = require('notifications');
      notifApi(config.notif_config);
      break;
   case 'dao':
      var dao           = require('dao');
      dao(config.dao_config);
      break;
   case 'perms_prop_worker':
      var dao           = require('dao');
      dao.perms_prop_worker(config.perms_propagator_b);
      break;
   case 'auth_api':
      var authApi       = require('auth_api');
      authApi(config.auth_config);
      break;
   case 'crud_api':
      var crudApi       = require('crud_api');
      crudApi(config.crud_config);
      break;
   case 'peat_aggregator':
      var aggregator    = require('peat_aggregator');
      aggregator(config.aggregator_config)
      break;
   case 'tracklet-worker':
      var trackletworker = require('tracklet-worker');
      trackletworker(config.tracklet_worker_conf)
      break;
   default:
      break;
   }
}



