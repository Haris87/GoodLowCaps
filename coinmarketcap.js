var request = require('request');

function getCoins(options, successCallback, errorCallback){
	
	var start = options.start || '200';
	var limit = options.limit || '100';
	var url = 'https://api.coinmarketcap.com/v1/ticker/?start='+start+'&limit='+limit;
	
	request.get(url, { json:true }, function(err, res, body){
		if(err) {
			errorCallback(err);
		} else {
			successCallback(body);
		}
	});
	
}

module.exports = {getCoins: getCoins};