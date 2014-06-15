'use strict';

exports.init = function(req, res){
  console.log('deposit: show deposit page');
  var addr = ""; // newly created btc addr will go here.

  var bitcore = require("bitcore");

  var RpcClient = bitcore.RpcClient;

	var config = {
	  protocol: 'http',
	  user: 'rpc',
	  pass: '',
	  host: '127.0.0.1',
	  port: '18332',
	};

	var rpc = new RpcClient(config);

	rpc.getnewaddress( function(err, ret) {
	  if (err) {
	    console.error('An error occured getting new address');
	    console.error(err);
	    return;
	  }
	  console.log(ret);

	  if (ret) {
	  	if (ret.error) {
	  		console.error(ret.error);
	  	} else if (ret.result) {
	  		addr = ret.result;
	  		console.log("newly created bitcoin addr="+addr);
	  	}
	  }

	  res.render('deposit/index', { addr: addr });

	});

  
  
};
