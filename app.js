var coinmarketcap = require('./coinmarketcap');

coinmarketcap.getCoins({start: 300, limit: 100}, function(coins){
	var goodCoins = coins.filter(isGoodCoin);
	saveToFile(goodCoins);
});

function isGoodCoin(coin){
	var marketCapLessThan250k = coin.market_cap_usd < 250000;
	var marketCapMoreThan50k = coin.market_cap_usd > 50000;
	var supplyLessThan50m = coin.total_supply < 50000000;
	var moreThan2percent24hVolumeToCap = coin[24h_volume_usd]/coin.market_cap_usd > 0.02;
	var totalSupplyCloseToAvailableSupply = coin.available_supply/coin.total_supply > 0.8; 
	
	if(	marketCapLessThan250k && 
		marketCapMoreThan50k && 
		supplyLessThan50m && 
		moreThan2percent24hVolumeToCap && 
		totalSupplyCloseToAvailableSupply) {
		
		return coin;
	}
}

function saveToFile(coins) {
	var outputfile = 'goodcoins.json';
	fs.writeFile(outputfile, JSON.stringify(goodCoins), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("Coins saved: ", goodCoins.length);
	}); 
}