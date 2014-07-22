'use strict';

var bitcore = require("bitcore");
var Address = bitcore.Address;

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
    } else {
      // test if it is valid address
      
      var bitcoreAddr = new Address(req.body.addr);
      if (!bitcoreAddr.isValid()) {
        workflow.outcome.errfor.addr = 'not a valid address';
      }
    }

    if (!req.body.amount) {
      workflow.outcome.errfor.amount = 'required';
    } else {
      // test if it is a number
      var fAmount = parseFloat(req.body.amount);
      if (isNaN(fAmount)) {
        workflow.outcome.errfor.amount = 'must be a number';
      }
    }

    // if (!req.body.note) {
    //   workflow.outcome.errfor.note = 'required';
    // }

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
    if (addr && amount && !isNaN(fAmount)) {

    	sendBtc(addr, fAmount);
    }
    workflow.emit('response');
  });

  workflow.emit('validate');
};
