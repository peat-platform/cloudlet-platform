/**
 * Created by dconway on 16/06/15.
 */

'use strict';
var squel      = require("squel");
var zmq        = require('m2nodehandler');
var couchbase  = require('couchbase');

var senderToSubscription;
var bucket;


var init = function(couchbase_cluster){
   senderToSubscription = zmq.sender({ spec : 'tcp://127.0.0.1:49500', id : 'f', bind : false, type : 'pub', isMongrel2 : false });
   var cluster          = new couchbase.Cluster( couchbase_cluster );
   bucket               = cluster.openBucket('objects');
}


var getAppSubscriptions = function (msg, api_key) {

   var meta = {
      limit  : 50,
      offset : 0
   };

   var n1ql = squel.select();

   n1ql.from("objects")
      .field('`@id` as id')
      .field('`@data`')
      .limit(meta.limit)
      .offset(meta.offset);

   n1ql.where('`@data`.client_id = `' + api_key + '`');

   n1ql = couchbase.N1qlQuery.fromString(n1ql.toString());

   bucket.query(n1ql, [], function(err, res)
   {
      if (err) {
         console.log("Error running N1QL Query for PEAT Subscriptions: " + err);
      }
      else {
         senderToSubscription.send({
            'type'    : 'appSubs',
            'result' : res,
            'token'   : msg.token
         });
      }
   });

};




module.exports.init                = init;
module.exports.getAppSubscriptions = getAppSubscriptions;