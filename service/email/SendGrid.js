const AbstractEmail = require("./AbstractEmail");
const Helper = require("../Helper");
const sgMail = require('@sendgrid/mail')

class SendGrid extends AbstractEmail {

    /**
     * @param to
     * @param subject
     * @param cc
     * @param bcc
     * @param from
     * @param emailBodyText
     * @param emailBodyHtml
     * @param replyTo
     * @param templateId
     * @param substitutions
     * @returns {Promise<boolean>}
     */
    sendEmail(to, subject, cc, bcc, from, emailBodyText, emailBodyHtml, replyTo = "", templateId = "", substitutions = {}) {
        return new Promise((resolve, reject) => {

            const filteredToS = to.filter(email => {
                if (Helper.validateEmail(email)) {
                    return email;
                }
            });

            const msg = {
                to: filteredToS,
                from,
                subject,
                text: emailBodyText,
                html: emailBodyHtml,
            }

            if (!Helper.isFalsy(cc)) {
                msg['cc'] = cc.filter(email => {
                    if (Helper.validateEmail(email)) {
                        return email;
                    }
                });
            }

            if (!Helper.isFalsy(bcc)) {
                msg['bcc'] = bcc.filter(email => {
                    if (Helper.validateEmail(email)) {
                        return email;
                    }
                });
            }

            if (!Helper.isFalsy(replyTo) && Helper.validateEmail(replyTo)) {
                msg['replyTo'] = replyTo;
            }

            if (!Helper.isFalsy(templateId)) {
                msg['templateId'] = templateId;
                if (!Helper.isFalsy(substitutions)) {
                    msg['substitutions'] = substitutions;
                }
            }

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            sgMail
              .send(msg)
              .then(result => {
                  resolve(true);
              })
              .catch(error => {
                  console.log(error);
                  reject(false);
              })

        });

    }
}

module.exports = SendGrid;
