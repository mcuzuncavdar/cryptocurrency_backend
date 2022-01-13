const mongoose = require("mongoose");
const Joi = require('joi');

const Log = mongoose.model('Log', {

    logType: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['error', 'warning', 'info', 'bug']
    },
    logSubject: {
        type: String,
        required: true,
        lowercase: true
    },
    logMessage: {
        type: String,
        required: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    }

});

function validateLog(log) {
    const schema = Joi.object().keys({
        logType: Joi.string().required(),
        logSubject: Joi.string().required(),
        logMessage: Joi.string().required(),
    });

    return schema.validate(log);
}

module.exports.Log = Log;
module.exports.validateLog = validateLog;
