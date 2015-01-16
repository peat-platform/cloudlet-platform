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
var authApi       = require('auth-api');
var crudApi       = require('crud-api');


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
      '-----END PUBLIC KEY-----'
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
      '-----END PUBLIC KEY-----'
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
   }
};


var perms_config = {
   dao_sink        : { spec:'tcp://127.0.0.1:49999', bind:false, type:'push', id:'a' },
   mongrel_handler : {
      source : { spec:'tcp://127.0.0.1:49909', bind:false, type: 'pull', isMongrel2:true, id:'b' },
      sink   : { spec:'tcp://127.0.0.1:49910', bind:false, type: 'pub',  isMongrel2:true, id:'c' }
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
   }
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

process.setMaxListeners(60);

process.on('uncaughtException', function (er) {
   console.error(er);
   if (undefined !== er){
      console.error(er.stack);
   }
   process.exit(1);
});

dao(dao_config);
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
redirect();
