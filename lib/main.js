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
var cloudletApi   = require('cloudlet-api');
var objectApi     = require('object-api');
var attachmentApi = require('attachments-api');
var searchApi     = require('search-api');
var permsApi      = require('permissions-api');
var typeApi       = require('type-api');
var notifApi      = require('notifications');
var dao           = require('dao');
var redirect      = require('./https_redirect.js');
var authApi       = require('auth-api');
var crudApi       = require('crud-api');
var rrd           = require('peat-rrd');
var aggregator    = require('peat-aggregator')


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
   graphs   : { openi_cloudlet_api_report : {
                  openi_cloudlet_get : { color : "0F6AB4",  label : "GET"},
                  openi_cloudlet_put : { color : "C5862B",  label : "PUT"},
                  openi_cloudlet_post : { color : "10A54A",  label : "POST"},
                  openi_cloudlet_delete : { color : "A41E22",  label : "DELETE"}
                     },
                openi_cloudlet_stats_report : {
                  openi_cloudlet_get : { color : "C5862B",  label : "GET"},
                  openi_cloudlet_get_all : { color : "99CC00",  label : "GET ALL"}
                     },
                openi_object_api_report : {
                  openi_object_get : { color : "0F6AB4",  label : "GET"},
                  openi_object_put : { color : "C5862B",  label : "PUT"},
                  openi_object_post : { color : "10A54A",  label : "POST"},
                  openi_object_delete : { color : "A41E22",  label : "DELETE"}
                     },
                openi_object_stats_report : {
                  openi_object_get : { color : "0F6AB4",  label : "GET"},
                  openi_object_get_id_only : { color : "009999",  label : "ID ONLY"},
                  openi_object_get_resolve : { color : "3333CC",  label : "RESOLVE"}
                     },
                openi_type_api_report : {
                  openi_type_get : { color : "0F6AB4",  label : "GET"},
                  openi_type_put : { color : "C5862B",  label : "PUT"},
                  openi_type_post : { color : "10A54A",  label : "POST"},
                  openi_type_delete : { color : "A41E22",  label : "DELETE"}
                     }
               }

}


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
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----',
   monitoring : { cloudlet : monitoring_config.cloudlet }
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
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----',
   monitoring : { object : monitoring_config.object },
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
};


var attachment_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'d' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49913', id:'e3', bind:false, type:'pull', isMongrel2:true },
      sink   : { spec:'tcp://127.0.0.1:49914', id:'f3', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/attachment_api',
      'log_level': 'debug',
      'as_json'  : true
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----'
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
   },
   monitoring : { type : monitoring_config.type }
};


var perms_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49909', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      sink   : { spec:'tcp://127.0.0.1:49910', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
   },
   internal_handler : {
      source : {spec : 'tcp://127.0.0.1:49570', bind : true,  subscribe: '', type : 'sub', id : 'AuthSource'},
      sink   : {spec : 'tcp://127.0.0.1:49570 ', bind : false, subscribe: '', type : 'pub', id : 'AuthSink', asJson: true}
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/permissions_api',
      'log_level': 'debug',
      'as_json'  : true
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----'
};

var dao_config = {
   dao_sink       : {spec:'tcp://127.0.0.1:49997', bind:false, id:'q1', type:'pull' },
   sub_sink       : {spec:'tcp://127.0.0.1:49500', bind:false, id:'subpush', type:'pub' },
   logger_params  : {
      'path'      : '/opt/openi/cloudlet_platform/logs/dao',
      'log_level' : 'debug',
      'as_json'   : true
   }
};


var dao_proxy_config = {
   frontend      : 'tcp://127.0.0.1:49999',
   backend       : 'tcp://127.0.0.1:49997'
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
};


var http_swagger_def_config = {
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:48907', id:'i', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:48904' },
      sink   : { spec:'tcp://127.0.0.1:48908', id:'j', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/swagger-def-http',
      'log_level': 'info',
      'as_json'  : true
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
      'path'      : '/opt/openi/cloudlet_platform/logs/notification.log',
      'log_level' : 'debug',
      'as_json'   : false
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----'
};

var search_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'d' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49911', id:'e', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:49904' },
      sink   : { spec:'tcp://127.0.0.1:49912', id:'f', bind:false, type:'pub',  isMongrel2:true }
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/search_api',
      'log_level': 'debug',
      'as_json'  : true
   },
   trusted_security_framework_public_key: '-----BEGIN PUBLIC KEY-----\n'+
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
      'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
      '-----END PUBLIC KEY-----'
};


var auth_config = {
   dao_sink        : {
      spec:'tcp://127.0.0.1:49999',
      bind:false,
      type:'push',
      id:'a'
   },
   mongrel_handler : {
      source : {
         spec:'tcp://127.0.0.1:49917',
         bind:false, id:'b',
         type:'pull',
         isMongrel2:true
      },
      sink   : {
         spec:'tcp://127.0.0.1:49918',
         bind:false,
         id:'c',
         type:'pub',
         isMongrel2:true
      }
   },
   api_handler : {
      source : {spec : 'tcp://127.0.0.1:49559', bind : true, subscribe: '', type : 'sub', id : 'AuthSource'},
      sink : {spec : 'tcp://127.0.0.1:49559', bind : false, subscribe: '', type : 'pub', id : 'AuthSink', asJson: true}
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/crud_api',
      'log_level': 'debug',
      'as_json'  : false
   },
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


var crud_config = {
   dao_sink        : {
      spec:'tcp://127.0.0.1:49999',
      bind:false,
      type:'push',
      id:'a'
   },
   mongrel_handler : {
      source : {
         spec:'tcp://127.0.0.1:49915',
         bind:false, id:'b',
         type:'pull',
         isMongrel2:true
      },
      sink   : {
         spec:'tcp://127.0.0.1:49916',
         bind:false,
         id:'c',
         type:'pub',
         isMongrel2:true
      }
   },
   api_handler : {
      source : {spec : 'tcp://127.0.0.1:49557', bind : true, subscribe: '', type : 'sub', id : 'CRUDSource'},
      sink : {spec : 'tcp://127.0.0.1:49557', bind : false, subscribe: '', type : 'pub', id : 'CRUDSink', asJson: true}
   },
   logger_params : {
      'path'     : '/opt/openi/cloudlet_platform/logs/crud_api',
      'log_level': 'debug',
      'as_json'  : false
   }
};

var aggregator_config = {
   dao_sink : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'d' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49925', id:'e', bind:false, type:'pull', isMongrel2:true, error_handle:'tcp://127.0.0.1:49904' },
      sink : { spec:'tcp://127.0.0.1:49926', id:'f', bind:false, type:'pub', isMongrel2:true }
   },
   logger_params : {
      'path' : '/opt/openi/cloudlet_platform/logs/aggregator',
      'log_level': 'debug',
      'as_json' : true
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

var redirect_config = { "in_m"   : { "spec":"tcp://127.0.0.1:50000", "bind":false, "type": "pull", "isMongrel2":true, "id":"ra" }, "out_m" : { "spec":"tcp://127.0.0.1:50001", "bind":false, "type": "pub",  "isMongrel2":true, "id":"rb" }}


process.setMaxListeners(60);

process.on('uncaughtException', function (er) {
   console.error(er);
   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});

rrd.init(monitoring_config)
aggregator(aggregator_config)
dao.dao_proxy(dao_proxy_config);
cloudletApi(cloudlet_config);
objectApi(object_config);
attachmentApi(attachment_config)
searchApi(search_config);
typeApi(type_config);
permsApi(perms_config);
swaggerDef(swagger_def_config);
swaggerDef(http_swagger_def_config);
notifApi(notif_config);
authApi(auth_config);
crudApi(crud_config);
dao(dao_config);
redirect(redirect_config);


