'use strict';

/**
 * actually send bitcoin
 * @param amount [float]
 */
var sendBtc = function(recipientAddr, amount) {
  	// this is only proof of concept.  a lot of stuff are hardcoded. 
	// should check if funds are available and has 6 confirmations at least.  
	// for mined coins, we need to have 30 confirmations.  
	//var recipientAddr = "muVsKeHFasunCKaM4K8BNrtwmN2yDfxFq6";
	//var amount = 0.001;
	var comment = "withdraw.  send from drywall";
	var commentto = "user to whom we send bitcoin";
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

	  // tx info output.  
	  var txinfo = {
  		txhash: txhash,
  		recipientAddr: recipientAddr,
  		amount: amount,
  	};

	});
};

exports.init = function(req, res){
  
  res.render('withdraw/index', { 
  	
  });
};


exports.withdraw = function(req, res){
  console.log("**** withdraw called ****");
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.addr) {
      workflow.outcome.errfor.addr = 'required';
    }

    if (!req.body.amount) {
      workflow.outcome.errfor.amount = 'required';
    }

    // if (!req.body.note) {
    //   workflow.outcome.errfor.note = 'required';
    // }

    // todo: validate addr is a valid bitcoin address
    // todo: validate amount is number
    // todo: check if amount < available fund of the user.  and less than total hot wallet fund.  


    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('sendFund');
  });

  workflow.on('sendFund', function() {
    console.log('***** sendFund ******* ');
    var addr = req.body.addr;
    var amount = req.body.amount;
    var note = req.body.note;

    var fAmount = parseFloat(amount); // amount as float
    console.log('addr='+addr+", amount="+amount+", note="+note);
    // addr and amount is required
    if (addr && amount && fAmount !== NaN) {

    	sendBtc(addr, fAmount);
    }
    workflow.emit('response');
  });

  workflow.emit('validate');
};
