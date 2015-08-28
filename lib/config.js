/*
 * cloudlet_platform
 *
 *
 * Copyright (c) 2013 dmccarthy
 * Licensed under the MIT license.
 */

'use strict';


var platform = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:42000', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      sink   : { spec:'tcp://127.0.0.1:42001', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
   },
   logger_params : {
      'path'     : '/opt/peat/cloudlet_platform/logs/cloudlet_platform',
      'log_level': 'debug',
      'as_json'  : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----',
   key: {
      sign: '-----BEGIN RSA PRIVATE KEY-----\n'+
      'MIIBOQIBAAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0vWXBEkk2pV42HsxKAmPs\n'+
      '789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQJAVCNxShi7ggXQVUlUxdAf\n'+
      'dvNrnKW1XKg/Rns15hx2LRq+6oKv0RsPH3N4P64ZYDt62Yf0o1uLC66YtVgf5BgN\n'+
      'mQIhANCAIYQ3KSXLLmDW/wSCE85eOipP7Duxaan694LdO8+XAiEAypKs/I9t7Ef5\n'+
      'k4zpmm1/qS7ht/LWr+FsqHPB1nQ9m/8CIE19YXeHHLbcJbd+EDd3tK69HHb/Tzf8\n'+
      'Pt4a1QSA/qqvAiBLupGYyTXawv12P5OE+7Jh2Pjg/5NqpOcuAjhQp5vwmQIgNFWQ\n'+
      'km1fT/DDO4nwU7EP3WgBpn26E9eckdtgxIO+FEM=\n'+
      '-----END RSA PRIVATE KEY-----',
         verify: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----'
   },
   auth_api_internal_worker : {
      source : {spec : 'tcp://127.0.0.1:49559',  bind : true,  subscribe: '', type : 'sub', id : 'AuthSource'},
      sink : {spec : 'tcp://127.0.0.1:49559',    bind : false, subscribe: '', type : 'pub', id : 'AuthSink', asJson: true}
   },
   comms           : {
      sink : { spec : 'tcp://127.0.0.1:49998',   bind : false, type : 'push', id : 'communication_id' }
   }
};



var internal_platform = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49909', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      sink   : { spec:'tcp://127.0.0.1:49910', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
   },
   logger_params : {
      'path'     : '/opt/peat/cloudlet_platform/logs/cloudlet_platform',
      'log_level': 'debug',
      'as_json'  : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----',
   key: {
      sign: '-----BEGIN RSA PRIVATE KEY-----\n'+
      'MIIBOQIBAAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0vWXBEkk2pV42HsxKAmPs\n'+
      '789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQJAVCNxShi7ggXQVUlUxdAf\n'+
      'dvNrnKW1XKg/Rns15hx2LRq+6oKv0RsPH3N4P64ZYDt62Yf0o1uLC66YtVgf5BgN\n'+
      'mQIhANCAIYQ3KSXLLmDW/wSCE85eOipP7Duxaan694LdO8+XAiEAypKs/I9t7Ef5\n'+
      'k4zpmm1/qS7ht/LWr+FsqHPB1nQ9m/8CIE19YXeHHLbcJbd+EDd3tK69HHb/Tzf8\n'+
      'Pt4a1QSA/qqvAiBLupGYyTXawv12P5OE+7Jh2Pjg/5NqpOcuAjhQp5vwmQIgNFWQ\n'+
      'km1fT/DDO4nwU7EP3WgBpn26E9eckdtgxIO+FEM=\n'+
      '-----END RSA PRIVATE KEY-----',
      verify: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----'
   },
   internal_permissions_worker : {
      source : {spec : 'tcp://127.0.0.1:49571',  bind : true,  subscribe: '', type : 'sub', id : 'AuthSource'},
      sink   : {spec : 'tcp://127.0.0.1:49572 ', bind : false, subscribe: '', type : 'pub', id : 'AuthSink', asJson: true}
   },
   internal_crud_worker : {
      source : {spec : 'tcp://127.0.0.1:49557', bind : true, subscribe: '', type : 'sub', id : 'CRUDSource'},
      sink : {spec : 'tcp://127.0.0.1:49557', bind : false, subscribe: '', type : 'pub', id : 'CRUDSink', asJson: true}
   },
   comms           : {
      sink : { spec : 'tcp://127.0.0.1:49998',   bind : false, type : 'push', id : 'communication_id' }
   }
};


var monitoring_config = {
   cloudlet : { get  : ['all'],
                post : [],
                put  : [],
                delete : [] },
   object   : { get  : ['id_only','resolve'],
                post : [],
                put  : [],
                delete : [] },
   type     : { get  : ['id_only'],
                post : [],
                put  : [],
                delete : [] },
   graphs   : { peat_cloudlet_api_report : {
                  peat_cloudlet_get : { color : "0F6AB4",  label : "GET"},
                  peat_cloudlet_put : { color : "C5862B",  label : "PUT"},
                  peat_cloudlet_post : { color : "10A54A",  label : "POST"},
                  peat_cloudlet_delete : { color : "A41E22",  label : "DELETE"}
                     },
                peat_cloudlet_stats_report : {
                  peat_cloudlet_get : { color : "C5862B",  label : "GET"},
                  peat_cloudlet_get_all : { color : "99CC00",  label : "GET ALL"}
                     },
                peat_object_api_report : {
                  peat_object_get : { color : "0F6AB4",  label : "GET"},
                  peat_object_put : { color : "C5862B",  label : "PUT"},
                  peat_object_post : { color : "10A54A",  label : "POST"},
                  peat_object_delete : { color : "A41E22",  label : "DELETE"}
                     },
                peat_object_stats_report : {
                  peat_object_get : { color : "0F6AB4",  label : "GET"},
                  peat_object_get_id_only : { color : "009999",  label : "ID ONLY"},
                  peat_object_get_resolve : { color : "3333CC",  label : "RESOLVE"}
                     },
                peat_type_api_report : {
                  peat_type_get : { color : "0F6AB4",  label : "GET"},
                  peat_type_put : { color : "C5862B",  label : "PUT"},
                  peat_type_post : { color : "10A54A",  label : "POST"},
                  peat_type_delete : { color : "A41E22",  label : "DELETE"}
                     }
               }

};


var public_perms_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      //source : { spec:'tcp://127.0.0.1:49927', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      source : { spec:'tcp://127.0.0.1:42000', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      //sink   : { spec:'tcp://127.0.0.1:49928', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
      sink   : { spec:'tcp://127.0.0.1:42001', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
   },
   subscription_handler : {
      sink : { spec : 'tcp://127.0.0.1:49505', id : 'f', bind : false, type : 'pull', isMongrel2 : true }
   },
   internal_handler : {
      source : {spec : 'tcp://127.0.0.1:49571', bind : true,  subscribe: '', type : 'sub', id : 'AuthSource'},
      sink   : {spec : 'tcp://127.0.0.1:49572 ', bind : false, subscribe: '', type : 'pub', id : 'AuthSink', asJson: true}
   },
   logger_params : {
      'path'     : '/opt/peat/cloudlet_platform/logs/permissions_api',
      'log_level': 'debug',
      'as_json'  : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----'
};


var dao_config = {
   dao_sink       : {spec:'tcp://127.0.0.1:49997', bind:false, id:'q1', type:'pull' },
   sub_sink       : {spec:'tcp://127.0.0.1:49500', bind:false, id:'subpush', type:'pub' },
   tracklet_worker : {spec:'tcp://127.0.0.1:49502', bind:false, id:'tracklet', type:'push' },
   perms_propagator_f : {spec:'tcp://127.0.0.1:49700', bind:false, id:'perms_f', type:'push' },
   perms_propagator_b : {spec:'tcp://127.0.0.1:49701', bind:false, id:'perms_b', type:'pull' },
   logger_params  : {
      'path'      : '/opt/peat/cloudlet_platform/logs/dao',
      'log_level' : 'debug',
      'as_json'   : false
   }
};

var perms_propagator_b = {spec:'tcp://127.0.0.1:49701', bind:false, id:'perms_b', type:'pull' }

var dao_proxy_config = {
   frontend      : 'tcp://127.0.0.1:49999',
   backend       : 'tcp://127.0.0.1:49997'
};


var dao_perms_propagator_config = {
   frontend      : 'tcp://127.0.0.1:49700',
   backend       : 'tcp://127.0.0.1:49701'
};


var tracklet_proxy_config = {
   frontend      : 'tcp://127.0.0.1:49502',
   backend       : 'tcp://127.0.0.1:49508'
};


var swagger_def_config = {
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49907', id:'g', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:49904' },
      sink   : { spec:'tcp://127.0.0.1:49908', id:'h', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/peat/cloudlet_platform/logs/swagger-def',
      'log_level': 'info',
      'as_json'  : false
   }
};


var http_swagger_def_config = {
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:48907', id:'i', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:48904' },
      sink   : { spec:'tcp://127.0.0.1:48908', id:'j', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/peat/cloudlet_platform/logs/swagger-def-http',
      'log_level': 'info',
      'as_json'  : false
   }
};

var notif_config = {

   notif_sink : {spec : 'tcp://127.0.0.1:49500', bind : true, type : 'sub', subscribe : '', id : 'NotificationReceiver'},
   notif_broadcaster : {spec : 'tcp://127.0.0.1:49501', bind : true, type : 'pub', id : 'NotificationBroadcaster'},

   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'dao_sink' },

   mongrel_handler : {
      source    : { spec : 'tcp://127.0.0.1:49503', id : 'e', bind : false, type : 'pull', isMongrel2 : true },
      sink      : { spec : 'tcp://127.0.0.1:49504', id : 'NotifReceiver', bind : false, type : 'pub', isMongrel2 : true },
      subsource : { spec : 'tcp://127.0.0.1:49505', id : 'f', bind : false, type : 'pull', isMongrel2 : true },
      subsink   : { spec : 'tcp://127.0.0.1:49506', id : 'subReceiver', bind : false, type : 'pub', isMongrel2 : true }
   },
   comms           : {
      sink : { spec : 'tcp://127.0.0.1:49998', bind : false, type : 'push', id : 'communication_id' }
   },
   logger_params   : {
      'path'      : '/opt/peat/cloudlet_platform/logs/notification.log',
      'log_level' : 'debug',
      'as_json'   : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----'
};


var aggregator_config = {
   dao_sink : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'d' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49925', id:'e', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:49904' },
      sink : { spec:'tcp://127.0.0.1:49926', id:'f', bind:false, type:'pub', isMongrel2:true }
   },
   logger_params : {
      'path' : '/opt/peat/cloudlet_platform/logs/aggregator',
      'log_level': 'debug',
      'as_json' : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----',
   monitoring : {
      aggregator : {
         get : [],
         post : []
      }
   }
};


var tracklet_worker_conf = {
   sink : {spec:'tcp://127.0.0.1:49508', bind:false,  id:'q1', type:'pull' },
   tracklet : {
      piwik : {
         token_auth : '90871c8584ddf2265f54553a305b6ae1',
         domain : 'http://localhost:8888/piwik/'
      },
      mysql : {
         host : 'localhost',
         user : 'piwik',
         password : 'password',
         database : 'piwik',
         multipleStatements : 'true'
      }
   }
}

var redirect_config = { "in_m"   : { "spec":"tcp://127.0.0.1:50000", "bind":false, "type": "pull", "isMongrel2":true, "id":"ra" }, "out_m" : { "spec":"tcp://127.0.0.1:50001", "bind":false, "type": "pub",  "isMongrel2":true, "id":"rb" }}


module.exports.monitoring_config            = monitoring_config
module.exports.aggregator_config            = aggregator_config
module.exports.dao_proxy_config             = dao_proxy_config
module.exports.tracklet_proxy_config        = tracklet_proxy_config
module.exports.dao_perms_propagator_config  = dao_perms_propagator_config
module.exports.perms_propagator_b           = perms_propagator_b
module.exports.public_perms_config          = public_perms_config
module.exports.swagger_def_config           = swagger_def_config
module.exports.http_swagger_def_config      = http_swagger_def_config
module.exports.notif_config                 = notif_config
module.exports.dao_config                   = dao_config
module.exports.redirect_config              = redirect_config
module.exports.tracklet_worker_conf         = tracklet_worker_conf
module.exports.platform                     = platform
module.exports.internal_platform            = internal_platform
