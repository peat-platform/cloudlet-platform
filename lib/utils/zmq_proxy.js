var zmq = require('zmq');


module.exports.create_proxy = function(config){

   //frontend should/could be router & backend should be dealer
   var frontend = zmq.socket('pull');
   var backend  = zmq.socket('push');

   frontend.bindSync(config.frontend);
   backend.bindSync(config.backend);

   frontend.on('message', function(msg) {
      backend.send(msg);
   });
};


