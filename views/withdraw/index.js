'use strict';

exports.init = function(req, res){
	// this is only proof of concept.  a lot of stuff are hardcoded. 
	// should check if funds are available and has 6 confirmations at least.  
	// for mined coins, we need to have 30 confirmations.  
	var recipientAddr = "muVsKeHFasunCKaM4K8BNrtwmN2yDfxFq6";
	var amount = 0.001;
	var comment = "withdraw.  send from drywall";
	var commentto = "user towhom we send bitcoin";
	var txhash = ""; // if send is successful, this variable will store tx hash.


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

	rpc.sendtoaddress(recipientAddr, amount, comment, commentto, function(err, ret) {
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
	  		txhash = ret.result;
	  		console.info("withdraw: withdraw done.  txhash="+txhash);
	  	}
	  }

	  res.render('withdraw/index', { txhash: txhash });

	});
};
