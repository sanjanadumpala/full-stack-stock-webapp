require('dotenv').config({ path: '../.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db('stockSearch');
const watchlist = db.collection('watchlist');
const portfolio = db.collection('portfolio');
const wallet = db.collection('wallet');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const { watch } = require('fs');
app.use(express.json());

const APItoken = process.env.FINNHUB_API
const highchartsAPI = process.env.POLYGON_API

app.use(cors());
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, 'dist/stock-search/browser')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/stock-search/browser/index.html'));
});

// COMPANY DESCRIPTION
app.get(`/description`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

//COMPANY'S HISTORICAL DATA
app.get(`/history`, async function (req, res) {
	let fromDate = req.query['pastdate'];
	let toDate = req.query['currentdate'];
	let stockTicker = req.query['ticker'];
	const url = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${highchartsAPI}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

//COMPANY'S HISTORICAL TIME DATA
app.get(`/historytime`, async function (req, res) {
	let fromDate = req.query['pastdate'];
	let toDate = req.query['currentdate'];
	let stockTicker = req.query['ticker'];
	const url = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${highchartsAPI}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY'S LATEST STOCK PRICE
app.get(`/lateststockprice`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/quote?symbol=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// AUTOCOMPLETE
app.get(`/autocomplete`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/search?q=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY NEWS
app.get(`/companynews`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	let fromDate = req.query['pastdate'];
	let toDate = req.query['currentdate'];
	const url = `https://finnhub.io/api/v1/company-news?symbol=${stockTicker}&from=${fromDate}&to=${toDate}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY TRENDS
app.get(`/trends`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY'S INSIDER SENTIMENT
app.get(`/sentiment`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${stockTicker}&from=2022-01-01&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY PEERS
app.get(`/peers`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/stock/peers?symbol=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// COMPANY EARNINGS
app.get(`/earnings`, async function (req, res) {
	let stockTicker = req.query['ticker'];
	const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${stockTicker}&token=${APItoken}`;
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

// ADD TO WATCHLIST
app.get(`/addwatchlist`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		await client.connect();
		let r = await watchlist.insertOne({ticker: stockTicker});
		const data = await watchlist.find({}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// DELETE FROM WATCHLIST
app.get(`/deletewatchlist`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		await client.connect();
		let r = await watchlist.deleteOne({ticker: stockTicker});
		const data = await watchlist.find({}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// GET WATCHLIST
app.get(`/getwatchlist`, async function (req, res) {
	try {
		await client.connect();
		const data = await watchlist.find({}).toArray();
		var watchlistAppend = []
		for (let i = 0; i < data.length; i++) {
			const url = `https://finnhub.io/api/v1/quote?symbol=${data[i].ticker}&token=${APItoken}`;
				const response = await fetch(url);
				const quote = await response.json();
				quote["ticker"] = data[i].ticker;
			const url2 = `https://finnhub.io/api/v1/stock/profile2?symbol=${data[i].ticker}&token=${APItoken}`;
				const response2 = await fetch(url2);
				const profile = await response2.json();
				quote["name"] = profile.name;
				watchlistAppend.push(quote);
		}

		//client.close();
		res.json(watchlistAppend);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// CHECK IF TICKER IN WATCHLIST
app.get(`/checkwatchlist`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		await client.connect();
		const data = await watchlist.find({ticker: stockTicker}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// ADD TO PORTFOLIO
app.get(`/addportfolio`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		let stockNum = req.query['stocks'];
		let totalCost = req.query['totalcost'];
		await client.connect();
		let r = await portfolio.insertOne({ticker: stockTicker, stocks: stockNum, totalcost: totalCost});
		const data = await portfolio.find({}).toArray();
		res.json(data);
		//client.close();
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// UPDATE PORTFOLIO
app.get(`/updateportfolio`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		let stockNum = req.query['stocks'];
		let totalCost = req.query['totalcost'];
		await client.connect();
		let r = await portfolio.updateOne({ticker: stockTicker}, {$set: {stocks: stockNum, totalcost: totalCost}} );
		const data = await portfolio.find({}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// DELETE FROM PORTFOLIO
app.get(`/deleteportfolio`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		await client.connect();
		let r = await portfolio.deleteOne({ticker: stockTicker});
		const data = await portfolio.find({}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// GET PORTFOLIO
app.get(`/getportfolio`, async function (req, res) {
	try {
		await client.connect();
		const data = await portfolio.find({}).toArray();
		var portfolioAppend = []
		for (let i = 0; i < data.length; i++) {
			const url = `https://finnhub.io/api/v1/quote?symbol=${data[i].ticker}&token=${APItoken}`;
				const response = await fetch(url);
				const profile = await response.json();
				profile["ticker"] = data[i].ticker;
				profile["stocks"] = data[i].stocks;
				profile["totalcost"] = data[i].totalcost;
				let tempMarketVal = (Number(data[i].stocks) * profile.c).toFixed(2);
				profile["marketvalue"] = tempMarketVal;
				profile["change"] = Number((Number(profile["marketvalue"]) - Number(data[i].totalcost)).toFixed(2));
				profile["changepercent"] = Number(((Number(profile["change"])/Number(data[i].totalcost))*100).toFixed(2));
				portfolioAppend.push(profile);
		}

		//client.close();
		res.json(portfolioAppend);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// CHECK IF TICKER IN PORTFOLIO
app.get(`/checkportfolio`, async function (req, res) {
	try {
		let stockTicker = req.query['ticker'];
		await client.connect();
		const data = await portfolio.find({ticker: stockTicker}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// GET WALLET
app.get(`/getwallet`, async function (req, res) {
	try {
		await client.connect();
		const data = await wallet.find({}).toArray();
		var walletAppend = []
		var totalMarketValue = 0
		const data2 = await portfolio.find({}).toArray();
		for (let i = 0; i < data2.length; i++) {
			const url = `https://finnhub.io/api/v1/quote?symbol=${data2[i].ticker}&token=${APItoken}`;
			const response = await fetch(url);
			const quote = await response.json();
			totalMarketValue += Number(data2[i].stocks) * quote.c;

		}
		data[0].totalmarketvalue = (Number(data[0].total) + totalMarketValue).toFixed(2)
		// client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});

// SET WALLET
app.get(`/setwallet`, async function (req, res) {
	try {
		let total = req.query['total'];
		await client.connect();
		let r = await wallet.updateOne({key: "wallet_key"}, {$set: {total: total}} );
		const data = await wallet.find({}).toArray();
		//client.close();
		res.json(data);
	}
	catch (error) {
		res.status(500).send(error.toString());
	}
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

