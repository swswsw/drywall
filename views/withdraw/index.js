'use strict';

exports.init = function(req, res){
  console.log('withdraw: show withdraw page');
  res.render('withdraw/index');
};
