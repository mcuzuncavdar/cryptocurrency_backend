const express = require('express');
const router = express.Router();
const Helper = require('../service/Helper');
const {User} = require('../model/User');
const tryCatch = require('../middlewares/tryCatch');
const ReplyUtils = require('../service/ReplyUtils');
/**
 *
 */
router.post('/register', tryCatch(async (req, res) => {

  const {body} = req;

  if (!body) {
    return res.status(401).json(ReplyUtils.fail('Please send your register credentials!'));
  }

  if (!('firstName' in body) || !body['firstName']) {
    return res.status(401).json(ReplyUtils.fail('Please fill your firstname!'));
  }

  if (!('lastName' in body) || !body['lastName']) {
    return res.status(401).json(ReplyUtils.fail('Please fill your lastname!'));
  }

  if (!('email' in body) || !Helper.validateEmail(body['email'])) {
    return res.status(401).json(ReplyUtils.fail('Your email is not valid!'));
  }

  if (!('password' in body) || Helper.isFalsy(body['password']) || body['password'].length < 3) {
    return res.status(401).json(ReplyUtils.fail('Your password is not valid!'));
  }

  if (!('repeatPassword' in body) || Helper.isFalsy(body['repeatPassword']) || body['repeatPassword'].length < 3) {
    return res.status(401).json(ReplyUtils.fail('Your repeat password is not valid!'));
  }

  if (body['password'] !== body['repeatPassword']) {
    return res.status(401).json(ReplyUtils.fail('Your passwords does not match!'));
  }

  let {firstName, lastName, email, password} = body;

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  password = password.trim();

  let user = await User.findOne({email});

  if (!Helper.isFalsy(user)) {
    return res.status(200).json(ReplyUtils.fail('User email is already exist!'));
  }

  User.create({firstName, lastName, email, password})
    .then(async result => {
      const token = await Helper.generateToken(result['id'], result['firstName'], result['lastName'], result['email']);
      return res.status(200).json(ReplyUtils.success({
        token,
        user: {
          id: result['id'],
          email: result['email'],
          firstName: result['firstName'],
          lastName: result['lastName'],
          role: result['roles'],
          mobilePhone: result['mobilePhone']
        }
      }));

    })
    .catch(error => {
      res.status(500).json(ReplyUtils.fail("User couldn't create. Error: " + error));
    })
}, 400));

/**
 *
 */
router.post('/generate/token', tryCatch(async (req, res) => {

  const {body} = req;

  if (!body) {
    return res.status(401).json(ReplyUtils.fail('Please send your email and password!'));
  }

  if (!('email' in body) || !Helper.validateEmail(body['email'])) {
    return res.status(401).json(ReplyUtils.fail('Your email is not valid!'));
  }

  if (!('password' in body) || Helper.isFalsy(body['password']) || body['password'].length < 3) {
    return res.status(401).json(ReplyUtils.fail('Your password is not valid!'));
  }

  const {email, password} = body;

  let user = await User.findOne({email, password, isActive: true});

  if (Helper.isFalsy(user)) {
    return res.status(404).json(ReplyUtils.fail('User not found!'));
  }

  const token = await Helper.generateToken(user['id'], user['firstName'], user['lastName'], user['email']);

  return res.status(200).json(ReplyUtils.success({
    token,
    user: {
      id: user['id'],
      email: user['email'],
      firstName: user['firstName'],
      lastName: user['lastName'],
      role: user['roles'],
      mobilePhone: user['mobilePhone']
    }
  }));

}, 400))

module.exports = router;
