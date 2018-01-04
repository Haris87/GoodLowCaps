var coinmarketcap = require('./coinmarketcap');
var fs = require('fs');
var exec = require('child_process').exec;


// Change these parameters to suite your search
var params = {
	highestMarketCap: 250000, 			// coins that have up to this much market cap ($), default: 250,000
	lowestMarketCap: 50000, 			// coins that have at least this much market cap ($), default: 50,000
	maxTotalSupply: 50000000, 			// total supply of coins should not be more than this number, default: 50,000,000
	minTotalAvailableSupplyRatio: 0.8, 	// ratio of available coins compared to total supply of coins, default: 0.8
	minVolume24hMarketCapRatio: 0.02, 	// 24h volume as percentage of market cap should be at least this much, default: 0.02
	maxPrice: 0.1						// coins that are priced less than this number ($), default: 0.1
}

function run(){

	// update params according to users input
	readUserInput();
	
	// log the params of execution to console
	logParams();

	// get coin listings
	coinmarketcap.getCoins(
		{ 
			start: 0, 
			limit: 1000
		}, 
		function(coins){
			// save coins that meet given parameters to output file
			saveToFile(coins.filter(isGoodCoin));
		}, 
		function(error){
			throw error;
		}
	);
};
run();

function readUserInput(){
	/*
	***********************
		parameter options:
		--max-cap: coins that have up to this much market cap ($), default: 250,000
		--min-cap: coins that have at least this much market cap ($), default: 50,000
		--max-supply: total supply of coins should not be more than this number, default: 50,000,000
		--supply-ratio: ratio of available coins compared to total supply of coins, default: 0.8
		--volume-cap-ratio: 24h volume as percentage of market cap should be at least this much, default: 0.02
		--max-price: coins that are priced less than this number ($), default: 0.1
		--help: prints this info
	**********************
	*/
	try {
		var input = process.argv.slice(2);

		if(input.indexOf('--max-cap') !== -1){
			
			params.highestMarketCap = Number(input[input.indexOf('--max-cap')+1] || params.highestMarketCap);
			if(!isNumber(params.highestMarketCap)){
				throw "--max-cap value given is not a number.";
			}
		}
		
		if(input.indexOf('--min-cap') !== -1){
			params.lowestMarketCap = Number(input[input.indexOf('--min-cap')+1] || params.lowestMarketCap);
			if(!isNumber(params.lowestMarketCap)){
				throw "--min-cap value given is not a number.";
			}
		}
		
		if(input.indexOf('--max-supply') !== -1){
			params.maxTotalSupply = Number(input[input.indexOf('--max-supply')+1] || params.maxTotalSupply);
			if(!isNumber(params.maxTotalSupply)){
				throw "--max-supply value given is not a number.";
			}
		}
		
		if(input.indexOf('--supply-ratio') !== -1){
			params.minTotalAvailableSupplyRatio = Number(input[input.indexOf('--supply-ratio')+1] || params.minTotalAvailableSupplyRatio);
			if(!isNumber(params.minTotalAvailableSupplyRatio)){
				throw "--supply-ratio value given is not a number.";
			}
		}
		
		if(input.indexOf('--volume-cap-ratio') !== -1){
			params.minVolume24hMarketCapRatio = Number(input[input.indexOf('--volume-cap-ratio')+1] || params.minVolume24hMarketCapRatio);
			if(!isNumber(params.minVolume24hMarketCapRatio)){
				throw "--volume-cap-ratio value given is not a number.";
			}
		}
		
		if(input.indexOf('--max-price') !== -1){
			params.maxPrice = Number(input[input.indexOf('--max-price')+1] || params.maxPrice);
			if(!isNumber(params.maxPrice)){
				throw "--max-price value given is not a number.";
			}
		}
		
		if(input.indexOf('--help') !== -1 || input.indexOf('-h') !== -1 ){
			help();
			process.exit(1);
		}
		
	} catch(e) {
		console.log('\x1b[31m%s%s\x1b[0m', "Exception: ", e);
		help();
		process.exit(1);
	}

}

function help(){
	console.log("\x1b[33m");
	console.log("***********************");
	
	console.log("To run the program type:");
	console.log("> node app");
	console.log("");

	console.log("Optional parameters:");
	console.log("--max-cap: coins that have up to this much market cap ($), default: 250,000");
	console.log("--min-cap: coins that have at least this much market cap ($), default: 50,000");
	console.log("--max-supply: total supply of coins should not be more than this number, default: 50,000,000");
	console.log("--supply-ratio: ratio of available coins compared to total supply of coins, default: 0.8");
	console.log("--volume-cap-ratio: 24h volume as percentage of market cap should be at least this much, default: 0.02");
	console.log("--max-price: coins that are priced less than this number ($), default: 0.1");
	console.log("--help: prints this info");
	console.log("");	
	
	console.log("Example with default params:");
	console.log("> node app --max-cap 250000 --min-cap 50000 --max-supply 50000000 --supply-ratio 0.8 --volume-cap-ratio 0.02 --max-price 0.1");

	console.log("**********************");
	console.log("\x1b[0m");
}

function logParams(){
	console.log("Parameters:");
	console.log("%s\x1b[32m%d\x1b[0m", "Market cap below: \n> ", params.highestMarketCap);
	console.log("%s\x1b[32m%d\x1b[0m", "Market cap above: \n> ", params.lowestMarketCap);
	console.log("%s\x1b[32m%d\x1b[0m", "Total supply below: \n> ", params.maxTotalSupply);
	console.log("%s\x1b[32m%d\x1b[0m", "Total supply to available supply ratio above: \n> ", params.minTotalAvailableSupplyRatio);
	console.log("%s\x1b[32m%d\x1b[0m", "24h volume to market cap ration above: \n> ", params.minVolume24hMarketCapRatio);
	console.log("%s\x1b[32m%d\x1b[0m", "Coin price below: \n> ", params.maxPrice);
};

function isGoodCoin(coin){
	if(coinMeetsConditions(coin, params)) {
		//add link to coin
		coin.link = "https://coinmarketcap.com/currencies/"+coin.id;
		console.log("%s \x1b[32m%s \x1b[36m%s\x1b[0m", 'Coin added:', coin.name, coin.symbol);
		return coin;
	}
};

function coinMeetsConditions(coin, params){
	var maxMarketCap = coin.market_cap_usd < params.highestMarketCap;
	var minMarketCap = coin.market_cap_usd > params.lowestMarketCap;
	var totalSupply = coin.total_supply < params.maxTotalSupply;
	var _24hMarketCapRatio = coin['24h_volume_usd']/coin.market_cap_usd > params.minVolume24hMarketCapRatio;
	var totalAvailableSupplyRatio = coin.available_supply/coin.total_supply > params.minTotalAvailableSupplyRatio; 
	var maxPrice = coin.price_usd < params.maxPrice;
	
	return maxMarketCap && 
		minMarketCap && 
		totalSupply && 
		_24hMarketCapRatio && 
		totalAvailableSupplyRatio &&
		maxPrice;
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

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}