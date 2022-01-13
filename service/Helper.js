const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

class Helper {

  static isFalsy = (data) => {
    return data === '' ||
      data === null ||
      data === 'null' ||
      data === undefined ||
      data === 'undefined' ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && Object.keys(data).length === 0)
  }

  static isNotNumeric = (value) => {
    return isNaN(value) || value === 'NaN';
  }

  static validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  static validateMobilePhone = (mobilePhone) => {
    const regex = /^(\+905\d{9}|05\d{9})$/;
    return regex.test(mobilePhone);
  }

  static validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    return regex.test(password);
  }

  static dateFormatter = (date, isTurkishFormat = true, showTime = false) => {
    let pureDate = new Date(date);
    let day = parseInt(pureDate.getDate()) < 10 ? "0" + pureDate.getDate() : pureDate.getDate();
    let month = parseInt(pureDate.getMonth()) + 1 < 10 ? "0" + (parseInt(pureDate.getMonth()) + 1) : pureDate.getMonth() + 1;
    let year = pureDate.getFullYear();
    let time = '';
    if (showTime) {
      time = ' ' + (parseInt(pureDate.getHours()) < 10 ? '0' + pureDate.getHours() : pureDate.getHours()) + ':' + (parseInt(pureDate.getMinutes()) < 10 ? '0' + pureDate.getMinutes() : pureDate.getMinutes());
    }
    return isTurkishFormat ? day + '-' + month + '-' + year + time : year + '-' + month + '-' + day + time;
  }

  static generateToken = (id, name, surname, email) => {
    return new Promise((resolve, reject) => {
      jwt.sign({
        id,
        name,
        surname,
        email
      }, JWT_SECRET_KEY, {expiresIn: '1w'}, (err, token) => {
        if (err) {
          reject(null);
        }
        resolve(token);
      });
    })

  }
}

module.exports = Helper;
