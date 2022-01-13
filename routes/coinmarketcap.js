const express = require('express');
const router = express.Router();
const tryCatch = require('../middlewares/tryCatch');
const authApi = require('../middlewares/authApi');
const ReplyUtils = require("../service/ReplyUtils");
const FetchUtils = require("../service/FetchUtils");
const {CurrencyFavorite} = require("../model/currencyFavorite");
const {User} = require("../model/User");
const xml2js = require('xml2js');
const parser = new xml2js.Parser()

router.get('/data-api/v3/topsearch/rank', authApi, tryCatch(async (req, res) => {
  try {
    let response = await FetchUtils.get('/data-api/v3/topsearch/rank');
    return res.json(ReplyUtils.success(response.data));
  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));

router.get('/data-api/v3/cryptocurrency/spotlight', authApi, tryCatch(async (req, res) => {
  try {
    let {dataType, limit, rankRange} = req.query;
    let response = await FetchUtils.get('/data-api/v3/cryptocurrency/spotlight?dataType=' + dataType + '&limit=' + limit + '&rankRange=' + rankRange);
    return res.json(ReplyUtils.success(response.data));
  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));

router.get('/data-api/v3/cryptocurrency/listing', authApi, tryCatch(async (req, res) => {
  try {
    let {start, limit, sortBy, sortType, convert, cryptoType, tagType, audited, aux} = req.query;
    let response = await FetchUtils.get('/data-api/v3/cryptocurrency/listing?start=' + start + '&limit=' + limit + '&sortBy=' + sortBy + '&sortType=' + sortType + '&convert=' + convert + '&cryptoType=' + cryptoType + '&tagType=' + tagType + '&audited=' + audited + '&aux=' + aux);
    return res.json(ReplyUtils.success(response.data));
  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));


router.get('/favorite', authApi, tryCatch(async (req, res) => {
  try {
    const {email, _id} = req.user;
    console.log(email);
    let currencyFavorites = await CurrencyFavorite.findOne({'User': _id});
    console.log(currencyFavorites);
    return res.json(ReplyUtils.success(currencyFavorites));
  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));


router.post('/favorite', authApi, tryCatch(async (req, res) => {
  try {
    const {_id, email} = req.user;
    const {favorites} = req.body;
    let currencyFavorites = await CurrencyFavorite.findOne().populate({
      path: 'User',
      match: {_id}
    });

    if (!currencyFavorites) {
      let newCurrencyFavorite = new CurrencyFavorite({
        User: _id,
        favoriteIds: favorites
      });

      await newCurrencyFavorite.save((err, data) => {
        if (err) return res.json(ReplyUtils.fail('Favorite insertion error. Please try again!'));
      });
    } else {
      currencyFavorites['favoriteIds'] = favorites;
      currencyFavorites.save((err, data) => {
        if (err) return res.json(ReplyUtils.fail('Favorite item insertion error. Please try again!'));
        return res.json(ReplyUtils.success(currencyFavorites['favoriteIds']));
      });
    }

  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));


router.get('/currency-rate', authApi, tryCatch(async (req, res) => {
  try {
    let currencyRates = await FetchUtils.getFromRemote('https://www.tcmb.gov.tr/kurlar/today.xml',
      {},
      {'Content-Type': 'text/xml'}
    );
    const parsedCurrencyRates = await parser.parseStringPromise(currencyRates);
    let reArrangedData = [];
    if (parsedCurrencyRates && ('Tarih_Date' in parsedCurrencyRates) && ('Currency' in parsedCurrencyRates['Tarih_Date'])) {
      parsedCurrencyRates['Tarih_Date']['Currency'].map(currencyDetail => {
        let sub = {};
        sub['name'] = currencyDetail['CurrencyName'][0].trim();
        sub['code'] = currencyDetail['$']['CurrencyCode'].trim();
        sub['BanknoteBuying'] = currencyDetail['BanknoteBuying'][0];
        sub['BanknoteSelling'] = currencyDetail['BanknoteSelling'][0];
        reArrangedData.push(sub);
      })
    }
    return res.json(ReplyUtils.success(reArrangedData));
  } catch (e) {
    return res.json(ReplyUtils.fail(e.message));
  }

}, 400));

module.exports = router;
