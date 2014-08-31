/*
 * cloudlet_platform
 *
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';
var emitter     = require('events').EventEmitter;
var swaggerDef  = require('swagger-def');
var cloudletApi = require('cloudlet_api');
var objectApi   = require('object_api');
var typeApi     = require('type_api');
var dao         = require('DAO');
var path        = require('path');

global.appRoot = path.resolve(__dirname);

var cloudlet_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49901', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      sink   : { spec:'tcp://127.0.0.1:49902', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/cloudlet_api',
      'log_level': 'debug',
      'as_json'  : true
   }
};


var object_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'d' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49903', id:'e', bind:false, type:'pull', isMongrel2:true },
      sink   : { spec:'tcp://127.0.0.1:49904', id:'f', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/object_api',
      'log_level': 'debug',
      'as_json'  : true
   }
};


var type_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49905', bind:false, id:'b', type:'pull', isMongrel2:true },
      sink   : { spec:'tcp://127.0.0.1:49906', bind:false, id:'c', type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/type_api',
      'log_level': 'debug',
      'as_json'  : false
   }
};


var dao_config = {
   dao_sink       : {spec:'tcp://127.0.0.1:49999', bind:true, id:'q1', type:'pull' },
   sub_sink       : {spec:'tcp://127.0.0.1:49500', bind:false, id:'subpush', type:'pub' },
   logger_params  : {
      'path'      : '/opt/openi/cloudlet_platform/logs/dao',
      'log_level' : 'debug',
      'as_json'   : true
   }
};


var swagger_def_config = {
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49907', id:'g', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:49904' },
      sink   : { spec:'tcp://127.0.0.1:49908', id:'h', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/swagger-def',
      'log_level': 'info',
      'as_json'  : true
   }
}


process.setMaxListeners(50);

process.on('uncaughtException', function (er) {
   console.error(er)
   //console.error(er.stack)
   process.exit(1)
})

dao(dao_config);
cloudletApi(cloudlet_config);
objectApi(object_config);
typeApi(type_config);
swaggerDef(swagger_def_config);
