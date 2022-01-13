const axios = require('axios');

class FetchUtils {
  static get = (uri, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
      let header = {
        ...{
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        }, ...headers
      }
      axios.get(process.env.COINMARKETCAP_URL + uri, {
        params,
        headers: header
      })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }

  static post = (uri, data, headers = {}) => {
    return new Promise((resolve, reject) => {
      let header = {
        ...{
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        }, ...headers
      }
      console.log(header);
      axios.post(process.env.COINMARKETCAP_URL + uri, data, {
        headers: header
      })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }

  static getFromRemote = (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params,
        headers
      })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }
}

module.exports = FetchUtils;
