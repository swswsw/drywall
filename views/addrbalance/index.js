'use strict';

exports.init = function(req, res){
  console.log('show balance');
  var balance = -1;

  // get address

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

	rpc.getreceivedbyaddress('mnK8n73hHzkwX7NWwPyjULJPJUF3debAdD', 0, function(err, ret) {
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
			res.writeHead(200, {'Content-Type': 'text/plain'});
	  		balance = ret.result;
	  		console.log("balance="+balance);
	  	}
	  }

	  res.end(balance.toString());

	});

  
  
};
