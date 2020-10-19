const async = require('async');
const Stack = require('../models/contentstack');

module.exports = (req, res, next) => {
  async.series([
    callback => {
      Stack.ContentType('header').Query()
        .toJSON()
        .find()
        .then(function success(result) {
          callback(null, result);
        }).catch(callback)
    },
    callback => {
      Stack.ContentType('footer').Query()
        .toJSON()
        .find()
        .then(function success(result) {
          callback(null, result);
        }).catch(callback)
    }
  ], (error, success) => {
    if (error) return next(error);
    res.locals.header = success[0];
    res.locals.footer = success[1];
    next();
  });
}
