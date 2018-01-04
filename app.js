var coinmarketcap = require('./coinmarketcap');
var fs = require('fs');
var exec = require('child_process').exec;


// Change these parameters to suite your search
var params = {
	highestMarketCap: 250000, 			// coins that have up to that much market cap ($), default: 250,000
	lowestMarketCap: 50000, 			// coins that have at least that much market cap ($), default: 50,000
	maxTotalSupply: 50000000, 			// total supply of coins should not be more than this number, default: 50,000,000
	minTotalAvailableSupplyRatio: 0.8, 	// ratio of available coins compared to total supply of coins, default: 0.8
	minVolume24hMarketCapRatio: 0.02 	// 24h volume as percentage of market cap should be at least this much, default: 0.02
}

function run(){
	logParams();
	// get coin listings
	coinmarketcap.getCoins({start: 0, limit: 1000}, function(coins){
		// save coins that meet given parameters to output file
		saveToFile(coins.filter(isGoodCoin));
	});
};
run();

function logParams(){
	console.log("Parameters:");
	console.log("Market cap below: \n>", params.highestMarketCap);
	console.log("Market cap above: \n>", params.lowestMarketCap);
	console.log("Total supply below: \n>", params.maxTotalSupply);
	console.log("Total supply to available supply ratio above: \n>", params.minTotalAvailableSupplyRatio);
	console.log("24h volume to market cap ration above: \n>", params.minVolume24hMarketCapRatio);
};

function isGoodCoin(coin){
	if(coinMeetsConditions(coin, params)) {
		//add link to coin
		coin.link = "https://coinmarketcap.com/currencies/"+coin.id;
		console.log('Coin added:', coin.name, coin.symbol);
		return coin;
	}
};

function coinMeetsConditions(coin, params){
	var maxMarketCap = coin.market_cap_usd < params.highestMarketCap;
	var minMarketCap = coin.market_cap_usd > params.lowestMarketCap;
	var totalSupply = coin.total_supply < params.maxTotalSupply;
	var _24hMarketCapRatio = coin['24h_volume_usd']/coin.market_cap_usd > params.minVolume24hMarketCapRatio;
	var totalAvailableSupplyRatio = coin.available_supply/coin.total_supply > params.minTotalAvailableSupplyRatio; 
	
	return maxMarketCap && 
		minMarketCap && 
		totalSupply && 
		_24hMarketCapRatio && 
		totalAvailableSupplyRatio;
};

function saveToFile(coins) {
	var outputfile = 'goodcoins.json';
	var contents = JSON.stringify({
		"params": params,
		"coins": coins
	});
	
	fs.writeFile(outputfile, contents, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("Coins saved: ", coins.length);
		exec(outputfile);
	}); 
};