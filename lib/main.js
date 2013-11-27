/*
 * cloudlet_platform
 * 
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';

var dataApi = require('data_api')
var dao     = require('dao'     )


var params = {
   dao_sub_q           : {spec:'tcp://127.0.0.1:49994'},
   mongrel_sub_q       : {spec:'tcp://127.0.0.1:49996', id:'data_api_conn'},
   data_api_sub_q      : {spec:'tcp://127.0.0.1:49995', id:'dao'},
   data_api_mong_sub_q : {spec:'tcp://127.0.0.1:49997', id:'test'},
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/data_api',
      'log_level': 'debug',
      'as_json'  : false
   }
}

var daoParams = {
   dao_sub_q      : {spec:'tcp://127.0.0.1:49994', id:'data_api'},
   mongrel_sub_q  : {spec:'tcp://127.0.0.1:49996', id:'dao_conn'},
   logger_params  : {
      'path'      : '/opt/openi/cloudlet_platform/logs/dao',
      'log_level' : 'debug',
      'as_json'   : true
   }
}

dataApi(params   )
dao    (daoParams)