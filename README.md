# GoodLowCaps
Applciation that shorts through low market cap cryptocoins to find the ones with potential. Gets first thousand coins from coinmarket cap and checks each one for certain conditions. After you get the list (goodcoins.json file) you should research further by visiting their website, bitcointalk announcement, social media accounts, etc.

### How to use
Open a command prompt and run the following commands in the app directory:

 If running for the first time, install the dependencies:
```
npm install
```

To run the app:
```
node app
```

You can also run it with custom parameters:
```
--max-cap
    coins that have up to this much market cap ($), default: 250,000
--min-cap
    coins that have at least this much market cap ($), default: 50,000
--max-supply
    total supply of coins should not be more than this number, default: 50,000,000
--supply-ratio
    ratio of available coins compared to total supply of coins, default: 0.8
--volume-cap-ratio
    24h volume as percentage of market cap should be at least this much, default: 0.02
--max-price
    coins that are priced less than this number ($), default: 0.1
--help
    prints this info
```

Example with parameters:
```
node app --max-cap 250000 --min-cap 50000 --max-supply 50000000 --supply-ratio 0.8 --volume-cap-ratio 0.02 --max-price 0.1
```