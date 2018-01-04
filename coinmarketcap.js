var request = require('request');

function getCoins(options, successCallback, errorCallback){
	
	var start = options.start || '0';
	var limit = options.limit || '100';
	var url = 'https://api.coinmarketcap.com/v1/ticker/?start='+start+'&limit='+limit;
	
	console.log("Retrieving coin list from coinmarketcap...");
	request.get(url, { json:true }, function(err, res, body){
		if(err) {
			errorCallback(err);
		} else {
			console.log("Coin list retrieved from coinmarketcap.");
			console.log("Retrieved "+body.length+" coins.");
			successCallback(body);
		}
	});
	
}

module.exports = {getCoins: getCoins};