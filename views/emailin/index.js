'use strict';

exports.init = function(req, res){
  console.log('emailin: email coming in');
  res.render('emailin/index');
};
