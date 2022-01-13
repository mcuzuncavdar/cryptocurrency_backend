module.exports = async (req, res, next) => {

    try{
        const {body, query, params} = req;

        if (!body) {
            return res.status(200).send({
                success: false,
                data: '',
                message: 'Please fill the email requirements which are "to", "subject", "from", "emailBodyHtml".'
            });
        }

        if (!("to" in body) || !Array.isArray(body['to'])) {
            return res.status(200).json({
                success: false,
                data: '',
                message: 'No receiver! Please fill the "to" parameter as array contents emails.'
            });
        }

        if (!("subject" in body)) {
            return res.status(200).json({
                success: false,
                data: '',
                message: 'No subject! Please fill the "subject" parameter.'
            });
        }

        if (!("from" in body)) {
            return res.status(200).json({
                success: false,
                data: '',
                message: 'No sender! Please fill the "from" parameter as email string.'
            });
        }

        if (!("emailBodyText" in body) && !("emailBodyHtml" in body)) {
            return res.status(200).json({
                success: false,
                data: '',
                message: 'No email content! Please fill the "emailBodyText" parameter as plain text or "emailBodyHtml" as html.'
            });
        }

        next();

    }catch (err){
        return res.status(500).json({success: false, message: 'An error has occurred! Please try again later!'});
    }

}
