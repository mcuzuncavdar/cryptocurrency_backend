const Log = require("../service/log/log");

module.exports = (handlerFunction, errorStatusCode = null, errorMessage = null) => {
    return async (req, res, next) => {
        try {
            await handlerFunction(req, res, next);
        } catch (e) {
            Log('tryCatch Middleware', e.message)
                .then(result => {

                })
                .catch(error => {

                });
            next(errorMessage, errorStatusCode);
        }
    }
};
