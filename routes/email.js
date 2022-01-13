const express = require('express');
const router = express.Router();
const authApi = require('../middlewares/authApi');
const SendGrid = require("../service/email/SendGrid");
const checkEmailRequestContent = require('../middlewares/checkEmailRequestContent');
const {User} = require("../model/User");

/**
 *
 */
router.post('^/reminder/:emailvendor([a-zA-Z]+$)', checkEmailRequestContent, async (req, res, next) => {

  try {
    const {body, query, params} = req;
    let emailVendor = params.emailvendor.replace(' ', '');
    let {to, subject, cc, bcc, from, emailBodyText, emailBodyHtml, replyTo, templateId, substitutions} = body;

    let vendorInstance = null;
    if (emailVendor === 'sendgrid') {
      vendorInstance = new SendGrid();
    }

    if (!vendorInstance) {
      return res.status(200).json({success: false, data: {}, message: 'No valid vendor to send email!'});
    }

    to.map((async email => {
      const user = await User.findOne({email});
      if (!user) {
        return res.status(404).json({
          success: false,
          data: {},
          message: 'User not found with ' + email + ' address'
        })
      }
      emailBodyText = 'Your password is : ' + user.password;
      emailBodyHtml = 'Your password is : <strong>' + user.password + '</strong>';
      vendorInstance.sendEmail([email], subject, cc, bcc, from, emailBodyText, emailBodyHtml, replyTo, templateId, substitutions)
        .then(result => {
          return res.status(200).json({success: true, data: {}, message: 'Password is send to your e-mail successfully.'});
        }).catch(reject => {
        return res.status(200).json({
          success: false,
          data: {},
          message: 'Email couldn\'t be send. Please try again later.'
        });
      });

    }))


  } catch (err) {
    return res.status(422).json({
      success: false,
      data: {},
      message: 'An error has occurred. Please try again later.'
    });
  }

})


module.exports = router;
