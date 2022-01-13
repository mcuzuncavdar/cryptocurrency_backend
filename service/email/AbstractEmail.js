class AbstractEmail {

    constructor() {
        if (this.constructor === AbstractEmail) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    sendEmail(to, subject, cc, bcc, from, emailBodyText, emailBodyHtml, replyTo = "", templateId = "", substitutions = {}) {
        throw new Error("Method 'sendEmail()' must be implemented.");
    }

}

module.exports = AbstractEmail;
