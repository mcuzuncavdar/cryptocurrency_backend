const jwt = require('jsonwebtoken');
const {User} = require('../model/User');
const Helper = require("../service/Helper");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = async (req, res, next) => {
  try {
    const {authorization} = req.headers;

    if (!authorization) {
      return res.status(403).json({success: false, message: 'No token found. You are not authorised!'});
    }

    const token = authorization.replace('Bearer ', '').replace(/\s/g, '');

    jwt.verify(token, JWT_SECRET_KEY, async (err, payload) => {

      if (err) {
        return res.status(403).json({success: false, message: 'Token is invalid. You are not authorised!'});
      }

      const {id, name, surname, email} = payload;

      User.findOne({email})
        .then(user => {
          if (Helper.isFalsy(user)) {
            return res.status(403).send({
              success: false,
              message: 'User not found. Please check your token again!'
            });
          }
          req.user = user;
          next();
        })
        .catch(reject => {
          return res.status(500).json({
            success: false,
            message: 'An error has occurred! Please try again later!'
          });
        });

    })

  } catch (err) {
    return res.status(500).json({success: false, message: 'An error has occurred! Please try again later!'});
  }

}
